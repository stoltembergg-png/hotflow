import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const traffic = await prisma.trafficSource.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json({ data: traffic, total: traffic.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const impressions = body.impressions || 0;
  const clicks = body.clicks || 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? (body.investment || 0) / clicks : 0;
  const leads = body.leads || 0;
  const conversions = body.conversions || 0;
  const cpl = leads > 0 ? (body.investment || 0) / leads : 0;
  const cpa = conversions > 0 ? (body.investment || 0) / conversions : 0;
  const revenue = body.revenue || 0;
  const roas = (body.investment || 0) > 0 ? revenue / (body.investment || 0) : 0;
  const roi = (body.investment || 0) > 0 ? ((revenue - (body.investment || 0)) / (body.investment || 0)) * 100 : 0;
  const item = await prisma.trafficSource.create({
    data: { campaign: body.campaign || null, platform: body.platform || null, adSet: body.adSet || null, creative: body.creative || null, investment: body.investment || 0, impressions, reach: body.reach || 0, clicks, ctr, cpc, leads, conversions, revenue, roas, cpa, cpl, roi, organizationId: body.organizationId || 'default' },
  });
  return Response.json(item, { status: 201 });
}
