import { useWorldcoinContext } from "@/contexts/worldcoin-context/use-worldcoin-context";

import CommonHeader from "./common-header";
import MiniAppHeader from "./mini-app-header";

export default function Header() {
  const { enabled } = useWorldcoinContext();
  return enabled ? <MiniAppHeader /> : <CommonHeader />;
}
