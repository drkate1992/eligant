import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { handle, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requestOtpSchema } from "@/lib/validations";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { sendLoginOtpEmail } from "@/lib/mailer";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
  return handle(async () => {
    rateLimit(`login-otp:${ipFromRequest(req)}`, 10, 15 * 60 * 1000);

    const { email, password } = requestOtpSchema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Verify the password before issuing a code (don't reveal which part failed).
    if (
      !user ||
      !user.passwordHash ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new ApiError("Invalid email or password", 401);
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginOtpHash: await bcrypt.hash(code, 10),
        loginOtpExpires: new Date(Date.now() + OTP_TTL_MS),
      },
    });

    try {
      await sendLoginOtpEmail(user.email, code);
    } catch (err) {
      console.error("[request-otp] email delivery failed", err);
      throw new ApiError("We couldn't send your code right now. Please try again.", 502);
    }

    // In development (no email provider configured) return the code so the flow
    // is testable. This is never included in production responses.
    const devCode = process.env.NODE_ENV !== "production" ? code : undefined;
    return ok({ success: true, email: user.email, ...(devCode ? { devCode } : {}) });
  });
}
