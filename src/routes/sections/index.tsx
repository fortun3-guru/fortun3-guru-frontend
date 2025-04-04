import { Navigate, useRoutes } from "react-router-dom";

import { loginRoutes } from "./login";
import { otherRoutes } from "./other";
import { PATH_AFTER_LOGIN } from "../paths";
import { dashboardRoutes } from "./protected";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    ...loginRoutes,
    ...dashboardRoutes,
    ...otherRoutes,
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
