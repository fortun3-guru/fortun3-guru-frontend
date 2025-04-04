"use client";
import { useState } from "react";
import axios, { endpoints } from "@/libs/axios";
// import { signIn } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";

interface WalletAuthButtonProps {
  onSuccess?: () => void;
}

export function WalletAuthButton({ onSuccess }: WalletAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletAuth = async () => {
    console.log("doing this");
    if (!MiniKit.isInstalled()) {
      return;
    }

    setIsLoading(true);
    try {
      const { data: nonce } = await axios.get(endpoints.worldcoin.nonce);
      // const { nonce } = await res.json();
      // const nonce = "123456789";
      console.log("nonce", nonce);
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
        statement: "Sign in with your World ID wallet",
      });

      console.log({ finalPayload });

      if (finalPayload.status === "error") {
        throw new Error(finalPayload.error_code);
      }

      // const verification = await verifySiweMessage(finalPayload, nonce);

      const { data: verification } = await axios.post(
        endpoints.worldcoin.verify,
        {
          payload: finalPayload,
          nonce,
        }
      );
      // const verifyRes = await fetch("/api/complete-siwe", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     payload: finalPayload,
      //     nonce,
      //   }),
      // });
      // console.log("verifyRes", verifyRes);
      // const verification = await verifyRes.json();
      console.log("verification", verification);

      if (verification.isValid) {
        // await signIn("worldcoin-wallet", {
        //   message: finalPayload.message,
        //   signature: finalPayload.signature,
        //   address: finalPayload.address,
        //   nonce,
        //   redirect: false,
        // });

        // Call onSuccess if provided
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWalletAuth}
      disabled={isLoading}
      className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg border-2 border-yellow-900/50 font-bold shadow-md transition-colors disabled:opacity-50 tracking-wide"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="font-serif">Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="mr-2">🎰</span>
          <span className="font-serif">Connect Wallet</span>
        </div>
      )}
    </button>
  );
}
