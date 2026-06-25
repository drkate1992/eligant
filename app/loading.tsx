import { LoadingSpinner } from "@/components/shared/States";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <LoadingSpinner />
    </div>
  );
}
