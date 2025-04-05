import { Navigate } from "react-router-dom";
import { PATH_AFTER_LOGIN } from "@/routes/paths";
import useConnectWallet from "@/web3/use-connect-wallet";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { activeAccount } = useConnectWallet();

  if (!activeAccount) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  return children;
}
