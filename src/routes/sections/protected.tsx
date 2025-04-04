import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import LoadingSection from "@/components/loading-indecator/loading-section";

export const dashboardRoutes = [
  {
    path: "",
    element: (
      // <AuthGuard>
      <Suspense fallback={<LoadingSection loading />}>
        <Outlet />
      </Suspense>
      // </AuthGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
];
