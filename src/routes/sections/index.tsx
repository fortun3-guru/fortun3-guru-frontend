import Home from "@/pages/home";
import Nfts from "@/pages/nfts";
import Topup from "@/pages/topup";
import NotFound from "@/pages/404";
import HomeLayout from "@/layouts/home";
import Playground from "@/pages/playground";
import { useRoutes } from "react-router-dom";
import AuthGuard from "@/layouts/guard/auth-guard";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        <HomeLayout fit>
          <Home />
        </HomeLayout>
      ),
    },
    {
      path: "/topup",
      element: (
        <HomeLayout fit>
          <Topup />
        </HomeLayout>
      ),
    },
    {
      path: "/nfts",
      element: (
        <AuthGuard>
          <HomeLayout hideNetwork>
            <Nfts />
          </HomeLayout>
        </AuthGuard>
      ),
    },
    {
      path: "/playground",
      element: <Playground />,
    },
    { path: "*", element: <NotFound /> },
  ]);
}
