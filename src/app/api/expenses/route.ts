import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const where: any = {};
  if (searchParams.get('category')) where.category = searchParams.get('category');
  const expenses = await prisma.expense.findMany({ where, orderBy: { createdAt: 'desc' } });
  const total = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
  return Response.json({ data: expenses, total });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const expense = await prisma.expense.create({
    data: { description: body.description, amount: body.amount, category: body.category || 'outros', date: body.date ? new Date(body.date) : new Date(), recurring: body.recurring || false, notes: body.notes || null, organizationId: body.organizationId || 'default' },
  });
  return Response.json(expense, { status: 201 });
}
