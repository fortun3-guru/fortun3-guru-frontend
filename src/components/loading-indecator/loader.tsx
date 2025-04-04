import { cn } from "@/libs/utils";

type Props = {
  className?: string;
};

export default function Loader({ className }: Props) {
  return (
    <div
      className={cn(
        "w-12 h-12 border-4 border-gray-300 border-t-accent-foreground rounded-full animate-spin",
        className
      )}
    ></div>
  );
}
