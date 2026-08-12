import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'sales';
  switch (type) {
    case 'sales': {
      const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
      return Response.json({ type: 'sales', data: orders });
    }
    case 'financial': {
      const [orders, expenses] = await Promise.all([
        prisma.order.findMany({ where: { status: 'paid' } }),
        prisma.expense.findMany(),
      ]);
      const revenue = orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
      const exp = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
      return Response.json({ type: 'financial', revenue, expenses: exp, profit: revenue - exp });
    }
    case 'customers': {
      const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
      return Response.json({ type: 'customers', data: customers });
    }
    case 'campaigns': {
      const campaigns = await prisma.campaign.findMany();
      return Response.json({ type: 'campaigns', data: campaigns });
    }
    case 'products': {
      const products = await prisma.product.findMany();
      return Response.json({ type: 'products', data: products });
    }
    case 'content': {
      const content = await prisma.content.findMany({ orderBy: { createdAt: 'desc' } });
      return Response.json({ type: 'content', data: content });
    }
    case 'subscriptions': {
      const subs = await prisma.subscription.findMany();
      return Response.json({ type: 'subscriptions', data: subs });
    }
    default:
      return Response.json({ error: 'Invalid report type' }, { status: 400 });
  }
}
