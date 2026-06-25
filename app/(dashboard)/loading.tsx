import { SkelHeader, SkelStatRow, SkelCard } from "@/components/shared/Skeletons";

// Generic fallback for any dashboard route without its own loading.tsx.
export default function Loading() {
  return (
    <div>
      <SkelHeader />
      <div className="mb-6">
        <SkelStatRow />
      </div>
      <SkelCard bodyHeight="h-64" />
    </div>
  );
}
