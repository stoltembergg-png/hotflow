import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const where: any = { organizationId: orgId };
  if (searchParams.get('category')) where.category = searchParams.get('category');
  const expenses = await prisma.expense.findMany({ where, orderBy: { createdAt: 'desc' } });
  const total = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
  return NextResponse.json({ data: expenses, total });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const expense = await prisma.expense.create({
    data: { description: body.description, amount: body.amount, category: body.category || 'outros', date: body.date ? new Date(body.date) : new Date(), recurring: body.recurring || false, notes: body.notes || null, organizationId: orgId },
  });
  return NextResponse.json(expense, { status: 201 });
}

