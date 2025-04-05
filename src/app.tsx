import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

import Router from "./routes/sections";
import { ThemeProvider } from "./components/theme-provider";
import HoloProvider from "./contexts/holo-context/holo-provider";
import WorldcoinProvider from "./contexts/worldcoin-context/worldcoin-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThirdwebProvider>
        <HoloProvider>
          <WorldcoinProvider>
            <Router />
            <Toaster />
          </WorldcoinProvider>
        </HoloProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
