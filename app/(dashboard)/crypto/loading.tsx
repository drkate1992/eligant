import { SkelHeader, SkelStatRow, SkelCard, SkelRows } from "@/components/shared/Skeletons";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/shared/States";

export default function Loading() {
  return (
    <div>
      <SkelHeader action />
      <div className="mb-6">
        <SkelStatRow />
      </div>
      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-card" />
        <Skeleton className="h-28 w-full rounded-card" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-0">
          <div className="border-b border-line p-5">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4">
            <SkelRows rows={4} />
          </div>
        </Card>
        <div className="space-y-5">
          <SkelCard bodyHeight="h-40" />
          <SkelCard bodyHeight="h-44" />
        </div>
      </div>
    </div>
  );
}
