import { useState, useEffect } from "react";
import { PATH_AFTER_LOGIN } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

import { useAuthContext } from "../hooks/use-auth-context";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = () => {
    if (authenticated) {
      router.replace(PATH_AFTER_LOGIN);
    } else {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
