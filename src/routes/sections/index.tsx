import Home from "@/pages/home";
import Topup from "@/pages/topup";
import NotFound from "@/pages/404";
import HomeLayout from "@/layouts/home";
import { useRoutes } from "react-router-dom";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        <HomeLayout>
          <Home />
        </HomeLayout>
      ),
    },
    {
      path: "/topup",
      element: (
        <HomeLayout>
          <Topup />
        </HomeLayout>
      ),
    },
    { path: "*", element: <NotFound /> },
  ]);
}
