import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const members = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  return Response.json({ data: members, total: members.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(body.password || '123456', 10);
  const member = await prisma.user.create({
    data: { name: body.name, email: body.email, password: hashedPassword, role: body.role || 'viewer', organizationId: body.organizationId || 'default' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return Response.json(member, { status: 201 });
}
