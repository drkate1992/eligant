import { handle, ok, requireUserId } from "@/lib/api";
import { externalTransferSchema } from "@/lib/validations";
import { performExternalTransfer } from "@/lib/transfer";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    rateLimit(`transfer:${userId}`, 20, 60 * 60 * 1000);
    const input = externalTransferSchema.parse(await req.json());
    const result = await performExternalTransfer(userId, input);
    return ok(result, { status: 201 });
  });
}
