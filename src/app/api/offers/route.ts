import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const offers = await prisma.offer.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ data: offers, total: offers.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const offer = await prisma.offer.create({
    data: { name: body.name, productId: body.productId || null, originalPrice: body.originalPrice || null, promotionalPrice: body.promotionalPrice || null, discount: body.discount || 0, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null, status: body.status || 'active', cta: body.cta || null, link: body.link || null, description: body.description || null, type: body.type || 'standard', organizationId: body.organizationId || 'default' },
  });
  return Response.json(offer, { status: 201 });
}
