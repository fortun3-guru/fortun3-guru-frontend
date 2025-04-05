import { paths } from "@/routes/paths";
import logo from "@/assets/logo/logo.svg";
import axios, { endpoints } from "@/libs/axios";
import { fAddress } from "@/utils/format-address";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  MiniKit,
  Permission,
  RequestPermissionPayload,
} from "@worldcoin/minikit-js";

export default function MiniAppHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
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
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const walletAddress = window.MiniKit?.walletAddress;

  const requestPermission = useCallback(async () => {
    const requestPermissionPayload: RequestPermissionPayload = {
      permission: Permission.Notifications,
    };
    const payload = await MiniKit.commandsAsync.requestPermission(
      requestPermissionPayload
    );
    console.log(payload);
    // Handle the response
  }, []);

  useLayoutEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <header className="flex h-14 w-screen shrink-0 items-center absolute top-0 left-0 right-0 z-10 px-4 md:px-12">
      <img
        src={logo}
        alt="logo"
        onClick={() => router.push(paths.dashboard)}
        className="cursor-pointer"
      />
      <div className="ml-auto flex gap-2">
        {walletAddress ? (
          <Button
            variant="outline"
            type="button"
            className="justify-self-end"
            size="lg"
          >
            {fAddress(walletAddress || "")}
          </Button>
        ) : (
          <Button
            variant="outline"
            type="button"
            className="justify-self-end w-32"
            size="lg"
            onClick={() => connectWallet()}
            loading={isLoading}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
