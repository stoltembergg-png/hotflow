import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage') || '';
  const search = searchParams.get('search') || '';
  const where: any = {};
  if (stage) where.stage = stage;
  if (search) where.OR = [{ name: { contains: search } }, { contact: { contains: search } }];
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
  return Response.json({ data: leads, total: leads.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const lead = await prisma.lead.create({
    data: {
      name: body.name, contact: body.contact || null, source: body.source || null,
      campaign: body.campaign || null, productInterest: body.productInterest || null,
      stage: body.stage || 'new', potentialValue: body.potentialValue || null,
      organizationId: body.organizationId || 'default',
    },
  });
  return Response.json(lead, { status: 201 });
}
