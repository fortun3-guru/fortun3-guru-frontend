import { cn } from "@/libs/utils";

import Header from "../header";

export default function HomeLayout({
  children,
  fit = false,
}: {
  children: React.ReactNode;
  fit?: boolean;
}) {
  return (
    <div
      className={cn("container  w-screen relative", {
        "overflow-hidden h-screen": fit,
      })}
    >
      <Header />
      {children}
    </div>
  );
}
