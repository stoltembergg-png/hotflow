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
  if (searchParams.get('priority')) where.priority = searchParams.get('priority');
  const tasks = await prisma.task.findMany({ where, orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }] });
  return NextResponse.json({ data: tasks, total: tasks.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const task = await prisma.task.create({
    data: { title: body.title, description: body.description || null, assignee: body.assignee || null, priority: body.priority || 'medium', dueDate: body.dueDate ? new Date(body.dueDate) : null, status: body.status || 'todo', project: body.project || null, organizationId: orgId },
  });
  return NextResponse.json(task, { status: 201 });
}

