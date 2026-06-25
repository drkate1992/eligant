import { handle, ok, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { serializeNotification } from "@/lib/serialize";

export async function GET() {
  return handle(async () => {
    const userId = await requireUserId();
    const [items, unread] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return ok({ data: items.map(serializeNotification), unread });
  });
}

// Mark all (or one) notification as read.
export async function PATCH(req: Request) {
  return handle(async () => {
    const userId = await requireUserId();
    const body = await req.json().catch(() => ({}));
    if (body.id) {
      await prisma.notification.updateMany({
        where: { id: body.id, userId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }
    return ok({ success: true });
  });
}
