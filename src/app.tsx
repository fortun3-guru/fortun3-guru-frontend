import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

import Router from "./routes/sections";
import { ThemeProvider } from "./components/theme-provider";
import WorldcoinProvider from "./components/worldcoin/worldcoin-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThirdwebProvider>
        <WorldcoinProvider>
          <Router />
          <Toaster />
        </WorldcoinProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
