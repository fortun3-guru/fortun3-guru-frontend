import { createThirdwebClient } from "thirdweb";

if (!import.meta.env.VITE_THIRDWEB_CLIENT_ID) {
  throw new Error("THIRDWEB_CLIENT_ID is not set");
}

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});
