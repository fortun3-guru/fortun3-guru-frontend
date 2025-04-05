import HomeView from "@/sections/home/home-view";
import MiniAppHomeView from "@/sections/home/mini-app-home-view";
import { useWorldcoinContext } from "@/contexts/worldcoin-context/use-worldcoin-context";

export default function Home() {
  const { enabled } = useWorldcoinContext();
  return enabled ? <MiniAppHomeView /> : <HomeView />;
}
