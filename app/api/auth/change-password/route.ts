import bcrypt from "bcryptjs";
import { ApiError, handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const input = changePasswordSchema.parse(await req.json());

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.passwordHash) {
      throw new ApiError("Password change not available for this account", 400);
    }
    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw new ApiError("Current password is incorrect", 400);

    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return ok({ success: true });
  });
}
