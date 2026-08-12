import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (status) where.status = status;
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.customer.count({ where }),
  ]);
  return Response.json({ data: customers, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const customer = await prisma.customer.create({
    data: {
      name: body.name, email: body.email, phone: body.phone || null,
      telegram: body.telegram || null, status: body.status || 'active',
      source: body.source || null, organizationId: body.organizationId || 'default',
    },
  });
  return Response.json(customer, { status: 201 });
}
