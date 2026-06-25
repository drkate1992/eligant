import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogoLockup } from "@/components/shared/LogoMark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy px-5 text-center">
      <LogoLockup />
      <div>
        <div className="font-display text-7xl font-bold text-brand">404</div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-primary">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <Link href="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
