import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

import Router from "./routes/sections";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/auth-context/auth-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThirdwebProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
