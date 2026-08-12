import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) where.status = status;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);
  return Response.json({ data: orders, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const netAmount = (body.totalAmount || 0) - (body.discount || 0) - (body.fees || 0);
  const order = await prisma.order.create({
    data: { customerId: body.customerId, productId: body.productId, totalAmount: body.totalAmount, discount: body.discount || 0, fees: body.fees || 0, netAmount, paymentMethod: body.paymentMethod || null, status: body.status || 'pending', source: body.source || null, organizationId: body.organizationId || 'default' },
  });
  return Response.json(order, { status: 201 });
}
