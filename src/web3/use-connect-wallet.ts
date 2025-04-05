/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { createWallet } from "thirdweb/wallets";
import {
  useDisconnect,
  useActiveWallet,
  useConnectModal,
  useActiveAccount,
  useAutoConnect,
  useSwitchActiveWalletChain,
} from "thirdweb/react";

import { client } from "./client";
import { getChain } from "./chain";
import { useBoolean } from "../hooks/use-boolean";

export default function useConnectWallet() {
  const activeAccount = useActiveAccount();
  const { connect: connectModal } = useConnectModal();
  const connecting = useBoolean(false);
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    if ((window as any)?.ethereum) {
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const { isLoading } = useAutoConnect({
    client,
  });

  const disconnectWallet = useCallback(() => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
  }, [activeWallet, disconnect]);

  const connectWallet = useCallback(
    () =>
      (async () => {
        try {
          if (activeAccount && activeWallet) {
            throw new Error("Wallet already connected");
          }

          connecting.onTrue();

          const wallet = await connectModal({
            client,
            wallets: [
              createWallet("io.metamask"),
              createWallet("com.okex.wallet"),
            ],
            chains: getChain(),
            showAllWallets: false,
            size: "compact",
          });

          const account = wallet.getAccount();
          if (!account) throw new Error("Account not found");

          toast.success("Connected wallet successfully");
        } catch {
          toast.error("Failed to connect wallet");
        } finally {
          connecting.onFalse();
        }
      })(),
    [activeAccount, activeWallet, connecting, connectModal]
  );

  const isNetworkMatched = getChain().some(
    (chain) => chain.id === activeWallet?.getChain()?.id
  );

  const switchDefaultNetwork = useCallback(() => {
    if (!isNetworkMatched) {
      switchChain(getChain()[0]);
      window.location.reload();
    }
  }, [isNetworkMatched, switchChain]);

  return {
    activeWallet,
    connectWallet,
    isConnecting: connecting.value || isLoading,
    activeAccount,
    disconnectWallet,
    isNetworkMatched,
    switchDefaultNetwork,
  };
}
