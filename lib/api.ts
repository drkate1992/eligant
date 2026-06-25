import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "./auth";
import { prisma } from "./prisma";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Returns the authenticated user's id or throws a 401 ApiError. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError("Unauthorized", 401);
  }
  return session.user.id;
}

export async function requireUser() {
  const id = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError("Unauthorized", 401);
  return user;
}

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

/** Wraps a route handler, turning thrown ApiError/ZodError into JSON responses. */
export function handle<T>(fn: () => Promise<T>) {
  return fn().catch(toErrorResponse);
}

export function toErrorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: err.flatten().fieldErrors },
      { status: 422 },
    );
  }
  console.error("[API error]", err);
  return NextResponse.json(
    { error: "Something went wrong" },
    { status: 500 },
  );
}
