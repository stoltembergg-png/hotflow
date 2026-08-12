import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const where: any = { organizationId: orgId };
  if (search) where.name = { contains: search };
  const campaigns = await prisma.campaign.findMany({ where, include: { metrics: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: campaigns, total: campaigns.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const campaign = await prisma.campaign.create({
    data: { name: body.name, platform: body.platform || null, objective: body.objective || null, budget: body.budget || null, investment: body.investment || null, status: body.status || 'active', organizationId: orgId },
  });
  return NextResponse.json(campaign, { status: 201 });
}

