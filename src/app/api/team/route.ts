import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const members = await prisma.user.findMany({ where: { organizationId: orgId }, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: members, total: members.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(body.password || '123456', 10);
  const member = await prisma.user.create({
    data: { name: body.name, email: body.email, password: hashedPassword, role: body.role || 'viewer', organizationId: orgId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(member, { status: 201 });
}

