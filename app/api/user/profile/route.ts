import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        avatarUrl: true,
        kycStatus: true,
        twoFAEnabled: true,
        createdAt: true,
      },
    });
    return ok({ ...user, createdAt: user.createdAt.toISOString() });
  });
}

export async function PATCH(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const input = profileSchema.parse(await req.json());
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        name: `${input.firstName} ${input.lastName}`,
        phone: input.phone,
        country: input.country,
      },
      select: { firstName: true, lastName: true, phone: true, country: true },
    });
    return ok(user);
  });
}
