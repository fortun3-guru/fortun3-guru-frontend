import { paths } from "@/routes/paths";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import useConnectWallet from "@/web3/use-connect-wallet";

export default function ButtonSection() {
  const { connectWallet, isConnecting, activeAccount } = useConnectWallet();

  const router = useRouter();

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
      <Button
        size="lg"
        variant="default"
        className="bg-black/80 text-white hover:bg-black/70 px-6 py-2 rounded-lg text-sm"
      >
        Approve F3 Token
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
