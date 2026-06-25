import { handle, ok, requireUserId } from "@/lib/api";
import { getMonthly } from "@/lib/stats";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    return ok(await getMonthly(userId, 6));
  });
}
