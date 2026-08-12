import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const where: any = { organizationId: orgId };
  if (search) where.name = { contains: search };
  if (type) where.type = type;
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
  const enriched = await Promise.all(products.map(async (p: any) => {
    const orders = await prisma.order.findMany({ where: { productId: p.id, status: 'paid', organizationId: orgId } });
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    return { ...p, totalSales: orders.length, totalRevenue, avgTicket: orders.length > 0 ? totalRevenue / orders.length : 0 };
  }));
  return NextResponse.json({ data: enriched, total: products.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      name: body.name, description: body.description || null, category: body.category || null,
      price: body.price, promotionalPrice: body.promotionalPrice || null,
      status: body.status || 'active', type: body.type || 'product',
      checkoutUrl: body.checkoutUrl || null, imageUrl: body.imageUrl || null,
      organizationId: orgId,
    },
  });
  return NextResponse.json(product, { status: 201 });
}

