import NotFound from "@/pages/404";
import { Outlet } from "react-router-dom";

export const otherRoutes = [
  {
    element: <Outlet />,
    children: [{ path: "404", element: <NotFound /> }],
  },
];
