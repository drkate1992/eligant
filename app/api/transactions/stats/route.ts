import { handle, ok, requireUserId } from "@/lib/api";
import { getTxnStats } from "@/lib/stats";

export async function GET(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const sp = new URL(req.url).searchParams;
    const startDate = sp.get("startDate");
    const endDate = sp.get("endDate");
    const range =
      startDate || endDate
        ? {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lt: new Date(endDate) } : {}),
          }
        : undefined;
    return ok(await getTxnStats(userId, range));
  });
}
