import { paths } from "@/routes/paths";
import { useState, useEffect } from "react";
import { useRouter } from "@/routes/hooks/use-router";

import { useAuthContext } from "../hooks/use-auth-context";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      router.replace(paths.dashboard);
    } else {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
