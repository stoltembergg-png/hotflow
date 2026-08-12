import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const where: any = {};
  if (searchParams.get('type')) where.contentType = searchParams.get('type');
  if (searchParams.get('status')) where.status = searchParams.get('status');
  const content = await prisma.content.findMany({ where, orderBy: { createdAt: 'desc' } });
  return Response.json({ data: content, total: content.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const item = await prisma.content.create({
    data: { name: body.name, contentType: body.contentType || 'post', platform: body.platform || null, category: body.category || null, status: body.status || 'idea', publishDate: body.publishDate || null, caption: body.caption || null, cta: body.cta || null, hashtags: body.hashtags || null, fileUrl: body.fileUrl || null, notes: body.notes || null, organizationId: body.organizationId || 'default' },
  });
  return Response.json(item, { status: 201 });
}
