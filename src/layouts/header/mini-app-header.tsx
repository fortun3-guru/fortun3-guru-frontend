import { paths } from "@/routes/paths";
import logo from "@/assets/logo/logo.svg";
import { useRouter } from "@/routes/hooks/use-router";

export default function MiniAppHeader() {
  const router = useRouter();

  return (
    <header className="flex h-14 w-screen shrink-0 items-center absolute top-0 left-0 right-0 z-10 px-4 md:px-12">
      <img
        src={logo}
        alt="logo"
        onClick={() => router.push(paths.dashboard)}
        className="cursor-pointer"
      />
      <div className="ml-auto flex gap-2"></div>
    </header>
  );
}
