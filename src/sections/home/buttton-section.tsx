import { paths } from "@/routes/paths";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "@/routes/hooks/use-router";
import useConnectWallet from "@/web3/use-connect-wallet";
import { useAuthContext } from "@/contexts/auth-context/hooks/use-auth-context";

export default function ButtonSection() {
  const { connectWallet } = useConnectWallet();
  const { authenticated } = useAuthContext();
  const router = useRouter();

  if (!authenticated) {
    return (
      <Button
        variant="default"
        type="button"
        size="lg"
        className="bg-black/80 text-white hover:bg-black/70"
        onClick={() => connectWallet()}
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
