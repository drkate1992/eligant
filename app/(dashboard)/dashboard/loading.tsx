import { SkelStatRow, SkelCard } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/shared/States";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-56 w-full rounded-card" />
      <SkelStatRow />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <SkelCard bodyHeight="h-[200px]" />
        <SkelCard bodyHeight="h-72" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <SkelCard bodyHeight="h-72" />
        <div className="space-y-5">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <SkelCard bodyHeight="h-24" />
        </div>
      </div>
    </div>
  );
}
