import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import useConnectWallet from "@/web3/use-connect-wallet";
import useWalletBalance from "@/web3/hooks/use-wallet-balance";

export default function ButtonSection({
  handleConsult,
  consulting,
}: {
  handleConsult: () => Promise<void>;
  consulting: boolean;
}) {
  const {
    connectWallet,
    isConnecting,
    activeAccount,
    isNetworkMatched,
    switchDefaultNetwork,
  } = useConnectWallet();
  const checking = useBoolean(true);
  const executeBalance = useWalletBalance();
  const [f3Balance, setF3Balance] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      checking.onTrue();
      const balance = await executeBalance(activeAccount?.address);
      setF3Balance(+(balance?.f3 || 0));
      checking.onFalse();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount?.address]);

  const onConsult = () => {
    handleConsult();
  };

  if (!activeAccount) {
    return (
      <>
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
        <Button
          onClick={() => {
            router.push("/playground");
          }}
        >
          go to playground
        </Button>
      </>
    );
  }

  if (!isNetworkMatched) {
    return (
      <Button
        variant="default"
        type="button"
        size="lg"
        className="bg-black/80 text-white hover:bg-black/70"
        loading={isConnecting}
        onClick={() => switchDefaultNetwork()}
      >
        Switch Network
      </Button>
    );
  }

  return (
    <div className="flex gap-2 justify-center">
      {f3Balance ? (
        <Button
          onClick={onConsult}
          loading={consulting || checking.value}
          size="lg"
          variant="default"
          className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm min-w-[140px]"
        >
          That's it !!
        </Button>
      ) : (
        <Button
          onClick={() => router.push(paths.topup)}
          loading={checking.value}
          size="lg"
          variant="default"
          className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm min-w-[140px]"
        >
          Get F3 Token
        </Button>
      )}
    </div>
  );
}
