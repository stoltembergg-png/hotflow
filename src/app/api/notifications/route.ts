import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  const unread = notifications.filter((n: any) => !n.read).length;
  return Response.json({ data: notifications, unread });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  if (body.id) {
    await prisma.notification.update({ where: { id: body.id }, data: { read: true } });
  } else if (body.markAllRead) {
    await prisma.notification.updateMany({ data: { read: true } });
  }
  return Response.json({ success: true });
}
