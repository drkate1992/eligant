import { SkelHeader, SkelStatRow, SkelCard, SkelRows } from "@/components/shared/Skeletons";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/shared/States";

export default function Loading() {
  return (
    <div>
      <SkelHeader />
      <div className="mb-6">
        <SkelStatRow />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        <SkelCard bodyHeight="h-64" />
        <Card className="p-0">
          <div className="border-b border-line p-5">
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="p-4">
            <SkelRows rows={5} />
          </div>
        </Card>
      </div>
    </div>
  );
}
