import type { NextAuthConfig } from "next-auth";

// Route segments that require authentication. (Route groups like (dashboard)
// do not appear in the URL, so we match the real top-level segments.)
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/transactions",
  "/accounts",
  "/cards",
  "/transfers",
  "/local-transfer",
  "/international",
  "/deposit",
  "/swap",
  "/investments",
  "/crypto",
  "/goals",
  "/loans",
  "/tax-refund",
  "/grants",
  "/settings",
  "/support",
];

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

// Edge-safe config (no Node-only imports). Shared by middleware and the full
// server config. The Credentials provider with Prisma/bcrypt is added in auth.ts.
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isProtected = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );
      const isAuthPage = AUTH_PAGES.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );

      if (isProtected && !isLoggedIn) {
        return false; // redirect to signIn page
      }
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "USER";
        token.firstName = (user as { firstName?: string | null }).firstName ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.firstName = (token.firstName as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
