import { SkelHeader, SkelCard } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <div>
      <SkelHeader />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <SkelCard bodyHeight="h-80" />
        <SkelCard bodyHeight="h-72" />
      </div>
    </div>
  );
}
