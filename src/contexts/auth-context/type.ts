export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  signIn: (token: string, user: UserType) => Promise<void>;
  signOut: () => void;
};

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  walletAddress: string;
};
