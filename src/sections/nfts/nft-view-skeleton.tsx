import { Skeleton } from "@/components/shadcn/skeleton";

export default function NftViewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
      <Skeleton className="h-[475px] rounded-lg" />
    </div>
  );
}
