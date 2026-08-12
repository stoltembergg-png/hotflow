import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'sales';
  switch (type) {
    case 'sales': {
      const orders = await prisma.order.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json({ type: 'sales', data: orders });
    }
    case 'financial': {
      const [orders, expenses] = await Promise.all([
        prisma.order.findMany({ where: { status: 'paid', organizationId: orgId } }),
        prisma.expense.findMany({ where: { organizationId: orgId } }),
      ]);
      const revenue = orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
      const exp = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
      return NextResponse.json({ type: 'financial', revenue, expenses: exp, profit: revenue - exp });
    }
    case 'customers': {
      const customers = await prisma.customer.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json({ type: 'customers', data: customers });
    }
    case 'campaigns': {
      const campaigns = await prisma.campaign.findMany({ where: { organizationId: orgId } });
      return NextResponse.json({ type: 'campaigns', data: campaigns });
    }
    case 'products': {
      const products = await prisma.product.findMany({ where: { organizationId: orgId } });
      return NextResponse.json({ type: 'products', data: products });
    }
    case 'content': {
      const content = await prisma.content.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json({ type: 'content', data: content });
    }
    case 'subscriptions': {
      const subs = await prisma.subscription.findMany({ where: { organizationId: orgId } });
      return NextResponse.json({ type: 'subscriptions', data: subs });
    }
    default:
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  }
}

