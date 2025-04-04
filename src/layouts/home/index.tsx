import { PropsWithChildren } from "react";
import logo from "@/assets/logo/logo.svg";
import { Button } from "@/components/shadcn/button";

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="container mx-auto h-screen w-screen relative flex flex-col-reverse">
      <header className="flex h-20 w-full shrink-0 items-center absolute top-0 left-0 right-0">
        <img src={logo} alt="logo" />
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="justify-self-end" size="lg">
            Connect Wallet
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
