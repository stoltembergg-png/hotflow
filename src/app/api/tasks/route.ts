import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const where: any = {};
  if (searchParams.get('status')) where.status = searchParams.get('status');
  if (searchParams.get('priority')) where.priority = searchParams.get('priority');
  const tasks = await prisma.task.findMany({ where, orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }] });
  return Response.json({ data: tasks, total: tasks.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: { title: body.title, description: body.description || null, assignee: body.assignee || null, priority: body.priority || 'medium', dueDate: body.dueDate ? new Date(body.dueDate) : null, status: body.status || 'todo', project: body.project || null, organizationId: body.organizationId || 'default' },
  });
  return Response.json(task, { status: 201 });
}
