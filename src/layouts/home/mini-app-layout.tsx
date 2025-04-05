import { useState } from "react";
import { paths } from "@/routes/paths";
import logo from "@/assets/logo/logo.svg";
import { useRouter } from "@/routes/hooks/use-router";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="container h-screen w-screen relative">
      <header className="flex h-20 w-screen shrink-0 items-center absolute top-0 left-0 right-0 z-10 px-6 md:px-12">
        <img
          src={logo}
          alt="logo"
          onClick={() => router.push(paths.dashboard)}
          className="cursor-pointer"
        />
        <Button
          type="button"
          className="justify-self-end"
          onClick={() => setOpen(true)}
          size="lg"
        >
          Verify
        </Button>
      </header>
      {children}
    </div>
  );
}
