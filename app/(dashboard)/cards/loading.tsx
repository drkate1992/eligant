import { SkelHeader } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/shared/States";

export default function Loading() {
  return (
    <div>
      <SkelHeader />
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-72 w-full rounded-card" />
        ))}
      </div>
    </div>
  );
}
