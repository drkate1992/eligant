import bcrypt from "bcryptjs";
import { ApiError, handle, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  return handle(async () => {
    const input = resetPasswordSchema.parse(await req.json());

    const record = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new ApiError("This reset link is invalid or has expired", 400);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate any other outstanding tokens for this user.
      prisma.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
    ]);

    return ok({ success: true });
  });
}
