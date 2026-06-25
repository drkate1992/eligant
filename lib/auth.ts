import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";

const providers = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      otp: { label: "One-time code", type: "text" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password, otp } = parsed.data;
      // An emailed one-time code is mandatory for every login.
      if (!otp) return null;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      // Verify the one-time code: present, unexpired, and matching.
      if (
        !user.loginOtpHash ||
        !user.loginOtpExpires ||
        user.loginOtpExpires.getTime() < Date.now() ||
        !(await bcrypt.compare(otp, user.loginOtpHash))
      ) {
        return null;
      }

      // Consume the code so it can't be reused.
      await prisma.user.update({
        where: { id: user.id },
        data: { loginOtpHash: null, loginOtpExpires: null },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        role: user.role,
        image: user.avatarUrl,
      };
    },
  }),
];

// Add OAuth providers only when configured, so the app runs without keys.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }) as never,
  );
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }) as never,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
});
