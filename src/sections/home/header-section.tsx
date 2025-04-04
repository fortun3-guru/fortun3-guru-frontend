import { useState } from "react";
import logo from "@/assets/logo/logo.svg";
import { fAddress } from "@/utils/format-address";
import { Button } from "@/components/shadcn/button";
import useConnectWallet from "@/web3/use-connect-wallet";
import { useAuthContext } from "@/contexts/auth-context/hooks/use-auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";

export default function HeaderSection() {
  const { connectWallet, disconnectWallet } = useConnectWallet();
  const { authenticated, user } = useAuthContext();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-20 w-full shrink-0 items-center absolute top-0 left-0 right-0">
      <img src={logo} alt="logo" />
      <div className="ml-auto flex gap-2">
        {authenticated ? (
          <>
            <Button
              variant="outline"
              type="button"
              className="justify-self-end"
              onClick={() => setOpen(true)}
              size="lg"
            >
              {fAddress(user?.walletAddress || "")}
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect your wallet and sign you out of the
                    application.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => disconnectWallet()}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button
            variant="outline"
            type="button"
            className="justify-self-end"
            size="lg"
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
