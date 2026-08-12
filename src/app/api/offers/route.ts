import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const offers = await prisma.offer.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: offers, total: offers.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const offer = await prisma.offer.create({
    data: { name: body.name, productId: body.productId || null, originalPrice: body.originalPrice || null, promotionalPrice: body.promotionalPrice || null, discount: body.discount || 0, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null, status: body.status || 'active', cta: body.cta || null, link: body.link || null, description: body.description || null, type: body.type || 'standard', organizationId: orgId },
  });
  return NextResponse.json(offer, { status: 201 });
}

