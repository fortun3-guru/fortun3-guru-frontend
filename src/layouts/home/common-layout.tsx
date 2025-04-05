import { useState } from "react";
import { paths } from "@/routes/paths";
import { getChain } from "@/web3/chain";
import logo from "@/assets/logo/logo.svg";
import { useBoolean } from "@/hooks/use-boolean";
import { fAddress } from "@/utils/format-address";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import useConnectWallet from "@/web3/use-connect-wallet";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
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

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    connectWallet,
    disconnectWallet,
    activeAccount,
    isConnecting,
    activeWallet,
    isNetworkMatched,
  } = useConnectWallet();
  const switchChain = useSwitchActiveWalletChain();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const switching = useBoolean(false);

  const onSwitchChain = async (chainId: string) => {
    const chain = getChain().find((chain) => chain.id === parseInt(chainId));
    if (chain) {
      switching.onTrue();
      await switchChain(chain);
      window.location.reload();
      switching.onFalse();
    }
  };

  const chainId = activeWallet?.getChain()?.id;

  return (
    <div className="container h-screen w-screen relative">
      <header className="flex h-20 w-screen shrink-0 items-center absolute top-0 left-0 right-0 z-10 px-6 md:px-12">
        <img
          src={logo}
          alt="logo"
          onClick={() => router.push(paths.dashboard)}
          className="cursor-pointer"
        />
        <div className="ml-auto flex gap-2">
          {activeWallet && (
            <Select
              value={isNetworkMatched ? chainId?.toString() : undefined}
              onValueChange={onSwitchChain}
              disabled={switching.value}
            >
              <SelectTrigger className="!bg-[oklab(1_0_0_/_0.045)] text-white text-sm !h-10 w-[180px] border-b-[oklch(1_0_0_/_0.15)]">
                <SelectValue placeholder={"Unsupport Chain"} />
              </SelectTrigger>
              <SelectContent>
                {getChain().map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {activeAccount ? (
            <>
              <Button
                variant="outline"
                type="button"
                className="justify-self-end"
                onClick={() => setOpen(true)}
                size="lg"
              >
                {fAddress(activeAccount.address || "")}
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
              className="justify-self-end w-32"
              size="lg"
              onClick={() => connectWallet()}
              loading={isConnecting}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
