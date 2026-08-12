import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';
  const now = new Date();
  const startDate = new Date();
  switch (period) {
    case '7d': startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setDate(now.getDate() - 30); break;
    case '90d': startDate.setDate(now.getDate() - 90); break;
    case '12m': startDate.setFullYear(now.getFullYear() - 1); break;
    default: startDate.setDate(now.getDate() - 30);
  }
  const [orders, customers, expenses, leads] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startDate } } }),
    prisma.customer.findMany({ where: { createdAt: { gte: startDate } } }),
    prisma.expense.findMany({ where: { date: { gte: startDate } } }),
    prisma.lead.findMany({ where: { createdAt: { gte: startDate } } }),
  ]);
  const totalRevenue = orders.filter((o: any) => o.status === 'paid').reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const paidOrders = orders.filter((o: any) => o.status === 'paid');
  const totalPaid = paidOrders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
  return Response.json({
    revenue: totalRevenue, expenses: totalExpenses, profit: totalRevenue - totalExpenses,
    orders: orders.length, paidOrders: paidOrders.length,
    conversion: orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0,
    avgTicket: paidOrders.length > 0 ? totalPaid / paidOrders.length : 0,
    customers: customers.length, leads: leads.length, period,
  });
}
