import bcrypt from "bcryptjs";
import { handle, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { verifyEmailOtpSchema } from "@/lib/validations";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    rateLimit(`email-verify:${ipFromRequest(req)}`, 15, 15 * 60 * 1000);

    const { email, code } = verifyEmailOtpSchema.parse(await req.json());
    const normalized = email.toLowerCase();

    const otp = await prisma.emailOtp.findUnique({ where: { email: normalized } });
    if (
      !otp ||
      otp.expiresAt.getTime() < Date.now() ||
      !(await bcrypt.compare(code, otp.codeHash))
    ) {
      throw new ApiError("That code is invalid or has expired", 400);
    }

    await prisma.emailOtp.update({
      where: { email: normalized },
      data: { verifiedAt: new Date() },
    });

    return ok({ success: true });
  });
}
