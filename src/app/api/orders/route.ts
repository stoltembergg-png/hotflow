import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const where: any = { organizationId: orgId };
  if (status) where.status = status;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);
  return NextResponse.json({ data: orders, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const netAmount = (body.totalAmount || 0) - (body.discount || 0) - (body.fees || 0);
  const order = await prisma.order.create({
    data: { customerId: body.customerId, productId: body.productId, totalAmount: body.totalAmount, discount: body.discount || 0, fees: body.fees || 0, netAmount, paymentMethod: body.paymentMethod || null, status: body.status || 'pending', source: body.source || null, organizationId: orgId },
  });
  return NextResponse.json(order, { status: 201 });
}

