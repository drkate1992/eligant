import { SkelHeader, SkelStatRow, SkelRows } from "@/components/shared/Skeletons";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/shared/States";

export default function Loading() {
  return (
    <div>
      <SkelHeader action />
      <div className="mb-6">
        <SkelStatRow />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card className="p-0">
          <div className="border-b border-line p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="p-4">
            <SkelRows rows={8} />
          </div>
        </Card>
        <Skeleton className="h-96 w-full rounded-card" />
      </div>
    </div>
  );
}
