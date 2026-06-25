import { SkelCard } from "@/components/shared/Skeletons";

// Rendered inside the settings layout (which already shows the header + sub-nav),
// so this only fills the content column.
export default function Loading() {
  return <SkelCard bodyHeight="h-80" />;
}
