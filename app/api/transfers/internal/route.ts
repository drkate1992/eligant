import { handle, ok, requireUserId } from "@/lib/api";
import { internalTransferSchema } from "@/lib/validations";
import { performInternalTransfer } from "@/lib/transfer";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    rateLimit(`transfer:${userId}`, 20, 60 * 60 * 1000);
    const input = internalTransferSchema.parse(await req.json());
    const result = await performInternalTransfer(userId, input);
    return ok(result, { status: 201 });
  });
}
