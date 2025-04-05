import React from "react";
import { useWorldcoinContext } from "@/contexts/worldcoin-context/use-worldcoin-context";

import CommonHeader from "./common-layout";
import MiniAppHeader from "./mini-app-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { enabled } = useWorldcoinContext();
  return enabled ? (
    <MiniAppHeader>{children}</MiniAppHeader>
  ) : (
    <CommonHeader>{children}</CommonHeader>
  );
}
