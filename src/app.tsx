import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

import Router from "./routes/sections";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  // useEffect(() => {
  // 	// Passing appId in the install is optional
  // 	// but allows you to access it later via `window.MiniKit.appId`
  // 	MiniKit.install(appId?)
  // }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThirdwebProvider>
        <Router />
        <Toaster />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
