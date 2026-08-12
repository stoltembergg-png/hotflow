import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const where: any = { organizationId: orgId };
  if (searchParams.get('status')) where.status = searchParams.get('status');
  const subscriptions = await prisma.subscription.findMany({ where, orderBy: { createdAt: 'desc' } });
  const active = subscriptions.filter((s: any) => s.status === 'active');
  const mrr = active.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);
  return NextResponse.json({ data: subscriptions, total: subscriptions.length, mrr, activeCount: active.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const sub = await prisma.subscription.create({
    data: { plan: body.plan, amount: body.amount, status: body.status || 'active', startDate: new Date(body.startDate || Date.now()), nextBilling: body.nextBilling ? new Date(body.nextBilling) : null, customerId: body.customerId, organizationId: orgId },
  });
  return NextResponse.json(sub, { status: 201 });
}

