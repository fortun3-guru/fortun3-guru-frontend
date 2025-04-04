export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
};
