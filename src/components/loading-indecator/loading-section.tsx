import { cn } from "@/libs/utils";
import { PropsWithChildren } from "react";

import Loader from "./loader";

type Props = {
  className?: string;
  loading: boolean;
};

export default function LoadingSection({
  loading,
  className,
  children,
}: PropsWithChildren<Props>) {
  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-svh space-y-6",
          className
        )}
      >
        <Loader />
      </div>
    );
  }

  return children;
}
