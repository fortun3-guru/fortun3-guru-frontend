import { toast } from "sonner";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import useConnectWallet from "@/web3/use-connect-wallet";
import useMintingPay from "@/web3/hooks/use-minting-pay";
import useWalletBalance from "@/web3/hooks/use-wallet-balance";
import { useHoloContext } from "@/contexts/holo-context/use-holo-context";

export default function ButtonSection() {
  const { connectWallet, isConnecting, activeAccount } = useConnectWallet();

  const minting = useBoolean(false);
  const executeBalance = useWalletBalance();
  const [f3Balance, setF3Balance] = useState<number>(0);
  const executeMinting = useMintingPay();
  const { handleConsult, consulting } = useHoloContext();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const balance = await executeBalance(activeAccount?.address);
      console.log({ balance });
      setF3Balance(+(balance?.f3 || 0));
    })();
  }, [activeAccount, executeBalance]);

  const handleMinting = async () => {
    try {
      minting.onTrue();
      const { success } = await executeMinting();
      if (success) {
        toast.success("Minting success");
      }
    } catch (error) {
      console.log(error);
      toast.error("Minting failed");
    } finally {
      minting.onFalse();
    }
  };

  if (!activeAccount) {
    return (
      <Button
        variant="default"
        type="button"
        size="lg"
        className="bg-black/80 text-white hover:bg-black/70"
        onClick={() => connectWallet()}
        loading={isConnecting}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex gap-2 justify-center">
      <Button
        onClick={() => router.push(paths.topup)}
        size="lg"
        variant="default"
        className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
      >
        Get F3 Token
      </Button>
      {!!f3Balance && (
        <Button
          onClick={() => handleConsult()}
          loading={consulting}
          size="lg"
          variant="default"
          className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
        >
          That's it !!
        </Button>
      )}
      <Button
        onClick={handleMinting}
        loading={minting.value}
        size="lg"
        variant="default"
        className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
      >
        Minting
      </Button>
    </div>
  );

  //   return (
  //     <Button
  //       size="lg"
  //       variant="default"
  //       className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
  //     >
  //       That's it !!
  //     </Button>
  //   );
}
