import { toast } from "sonner";
import { fError } from "@/utils/format-error";
import axios, { endpoints } from "@/libs/axios";
import { useBoolean } from "@/hooks/use-boolean";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingSection from "@/components/loading-indecator/loading-section";

import { UserType } from "./type";
import { STORAGE_KEY } from "./constant";
import { AuthContext } from "./auth-context";
import { isValidToken, setSession } from "./utils";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserType | null>(null);
  const loading = useBoolean(true);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const { data } = await axios.get(endpoints.auth.me);
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during check user session:", error);
      const err = fError(error);
      toast.error(err);
      setUser(null);
    } finally {
      loading.onFalse();
    }
  }, [loading]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await axios.post(endpoints.auth.login, {
          email,
          password,
        });
        const { accessToken, user } = data;
        if (accessToken && user) {
          setUser(user);
          setSession(accessToken);
        }
      } catch (error) {
        const err = fError(error);
        toast.error(err);
        setUser(null);
        throw err;
      } finally {
        loading.onFalse();
      }
    },
    [loading]
  );

  const signOut = useCallback(() => {
    setSession(null);
    setUser(null);
    loading.onFalse();
  }, [setUser, loading]);

  const checkAuthenticated = user ? "authenticated" : "unauthenticated";

  const status = loading.value ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
    }),
    [user, signIn, signOut, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      <LoadingSection loading={loading.value}>{children}</LoadingSection>
    </AuthContext.Provider>
  );
}
