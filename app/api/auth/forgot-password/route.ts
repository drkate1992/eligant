import { randomBytes } from "crypto";
import { handle, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    rateLimit(`forgot:${ipFromRequest(req)}`, 5, 15 * 60 * 1000);
    const { email } = forgotPasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    let devResetUrl: string | undefined;
    if (user) {
      const token = randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        },
      });
      // In production, email this link via Resend instead of returning it.
      if (process.env.NODE_ENV !== "production") {
        devResetUrl = `/reset-password/${token}`;
      }
    }

    // Always respond success to avoid leaking which emails are registered.
    return ok({
      success: true,
      message: "If an account exists, a reset link has been sent.",
      ...(devResetUrl ? { devResetUrl } : {}),
    });
  });
}
