"use client";

import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { createWallet } from "thirdweb/wallets";
import { useAuthContext } from "@/contexts/auth-context/hooks/use-auth-context";
import {
  useConnect,
  useDisconnect,
  useActiveWallet,
  useConnectModal,
  useActiveAccount,
} from "thirdweb/react";

import { client } from "./client";
import { getChain } from "./chain";
import axios, { endpoints } from "../libs/axios";
import { useBoolean } from "../hooks/use-boolean";

export default function useConnectWallet() {
  const activeAccount = useActiveAccount();
  const { connect: connectModal } = useConnectModal();
  const { connect } = useConnect();
  const connecting = useBoolean(false);
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const error = useBoolean(false);
  const { signIn, signOut, user } = useAuthContext();

  const disconnectWallet = useCallback(() => {
    if (activeWallet) {
      disconnect(activeWallet);
      signOut();
    }
  }, [activeWallet, disconnect, signOut]);

  const connectWallet = useCallback(
    (isAutoConnect = false) =>
      (async () => {
        try {
          if (activeAccount && activeWallet) {
            throw new Error("Wallet already connected");
          }

          connecting.onTrue();

          if (isAutoConnect && user?.walletAddress) {
            try {
              // Attempt to connect with MetaMask
              const wallet = createWallet("io.metamask");
              await connect(async () => {
                await wallet.connect({
                  client,
                  chain: getChain(), // Include chain configuration
                });
                return wallet;
              });

              // Validate connected wallet address
              const connectedAddress = wallet?.getAccount()?.address;
              if (connectedAddress !== user.walletAddress) {
                throw new Error(
                  "Connected wallet does not match user's wallet address"
                );
              }

              return;
            } catch (err) {
              console.log(err);

              // Fallback to OKX Wallet if MetaMask fails
              try {
                const wallet = createWallet("com.okex.wallet");
                await connect(async () => {
                  await wallet.connect({
                    client,
                    chain: getChain(), // Include chain configuration
                  });
                  return wallet;
                });

                // Validate connected wallet address
                const connectedAddress = wallet?.getAccount()?.address;
                if (connectedAddress !== user.walletAddress) {
                  throw new Error(
                    "Connected wallet does not match user's wallet address"
                  );
                }

                return;
              } catch (fallbackError) {
                console.log(fallbackError);
                throw new Error("Failed to auto-connect with any wallet");
              }
            }
          }

          const wallet = await connectModal({
            client,
            wallets: [
              createWallet("io.metamask"),
              createWallet("com.okex.wallet"),
            ],
            chain: getChain(),
            showAllWallets: false,
            size: "compact",
          });

          const account = wallet.getAccount();
          if (!account) throw new Error("Account not found");

          // Regular connection flow
          const { data: message } = await axios.post(endpoints.auth.message, {
            address: account.address,
          });
          if (!message?.message) throw new Error("Failed to get message");

          const signature = await account.signMessage({
            message: message.message,
          });
          const { data: walletConnect } = await axios.post(
            endpoints.auth.verify,
            {
              address: account.address,
              signature,
            }
          );

          await signIn(walletConnect.accessToken, walletConnect.user);
          toast.success("Connected wallet successfully");
        } catch (e) {
          error.onTrue();
          console.log(e);
          toast.error("Failed to connect wallet");
        } finally {
          connecting.onFalse();
        }
      })(),
    [
      activeAccount,
      activeWallet,
      connecting,
      user?.walletAddress,
      connectModal,
      signIn,
      connect,
      error,
    ]
  );

  useEffect(() => {
    if (error.value) {
      disconnectWallet();
      error.onFalse();
    }
  }, [activeWallet, disconnect, disconnectWallet, error, error.value]);

  return {
    connectWallet,
    isConnecting: connecting.value,
    activeAccount,
    disconnectWallet,
  };
}
