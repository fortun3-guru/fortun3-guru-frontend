import { Suspense } from "react";
import Login from "@/pages/login";
import { Outlet } from "react-router-dom";
import CompactLayout from "@/layouts/compact";
import LoadingSection from "@/components/loading-indecator/loading-section";

export const loginRoutes = [
  {
    path: "login",
    element: (
      // <GuestGuard>
      <CompactLayout>
        <Suspense fallback={<LoadingSection loading />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
      // </GuestGuard>
    ),
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
];
