import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Run on everything except static assets and the API auth handler.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.png).*)"],
};
