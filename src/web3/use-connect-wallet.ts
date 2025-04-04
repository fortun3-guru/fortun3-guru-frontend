"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { createWallet } from "thirdweb/wallets";
import {
  useDisconnect,
  useActiveWallet,
  useConnectModal,
  useActiveAccount,
  useAutoConnect,
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
            chain: getChain(),
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

  return {
    connectWallet,
    isConnecting: connecting.value || isLoading,
    activeAccount,
    disconnectWallet,
  };
}
