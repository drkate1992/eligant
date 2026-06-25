import { SkelHeader, SkelCardGrid } from "@/components/shared/Skeletons";

export default function Loading() {
  return (
    <div>
      <SkelHeader action />
      <SkelCardGrid count={3} height="h-52" />
    </div>
  );
}
