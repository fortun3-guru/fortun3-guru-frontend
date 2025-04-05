import HomeView from "@/sections/home/home-view";
import { useWorldcoinContext } from "@/contexts/worldcoin-context/use-worldcoin-context";

export default function Home() {
  const { enabled } = useWorldcoinContext();
  return enabled ? <HomeView /> : <HomeView />;
}
