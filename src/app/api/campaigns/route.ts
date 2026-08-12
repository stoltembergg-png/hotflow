import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const where: any = {};
  if (search) where.name = { contains: search };
  const campaigns = await prisma.campaign.findMany({ where, include: { metrics: true }, orderBy: { createdAt: 'desc' } });
  return Response.json({ data: campaigns, total: campaigns.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const campaign = await prisma.campaign.create({
    data: { name: body.name, platform: body.platform || null, objective: body.objective || null, budget: body.budget || null, investment: body.investment || null, status: body.status || 'active', organizationId: body.organizationId || 'default' },
  });
  return Response.json(campaign, { status: 201 });
}
