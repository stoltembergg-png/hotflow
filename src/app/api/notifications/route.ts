import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;
  const notifications = await prisma.notification.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unread = notifications.filter((n: any) => !n.read).length;
  return NextResponse.json({ data: notifications, unread });
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;
  const body = await request.json();
  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, organizationId: orgId },
      data: { read: true },
    });
  } else if (body.markAllRead) {
    await prisma.notification.updateMany({
      where: { organizationId: orgId, read: false },
      data: { read: true },
    });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    await prisma.notification.deleteMany({
      where: { id, organizationId: orgId },
    });
  } else {
    await prisma.notification.deleteMany({
      where: { organizationId: orgId, read: true },
    });
  }
  return NextResponse.json({ success: true });
}