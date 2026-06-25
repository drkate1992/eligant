import { SkelHeader, SkelCardGrid } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <div>
      <SkelHeader action />
      <SkelCardGrid count={4} height="h-44" />
    </div>
  );
}
