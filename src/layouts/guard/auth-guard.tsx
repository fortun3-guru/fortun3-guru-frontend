import { Navigate } from "react-router-dom";
import { PATH_AFTER_LOGIN } from "@/routes/paths";
import useConnectWallet from "@/web3/use-connect-wallet";
import LoadingSection from "@/components/loading-indecator/loading-section";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { activeAccount, isConnecting } = useConnectWallet();

  if (isConnecting) {
    return <LoadingSection loading={true} />;
  }

  if (!activeAccount) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  return children;
}
