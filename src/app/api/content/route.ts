import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const where: any = { organizationId: orgId };
  if (searchParams.get('type')) where.contentType = searchParams.get('type');
  if (searchParams.get('status')) where.status = searchParams.get('status');
  const content = await prisma.content.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: content, total: content.length });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const body = await request.json();
  const item = await prisma.content.create({
    data: { name: body.name, contentType: body.contentType || 'post', platform: body.platform || null, category: body.category || null, status: body.status || 'idea', publishDate: body.publishDate || null, caption: body.caption || null, cta: body.cta || null, hashtags: body.hashtags || null, fileUrl: body.fileUrl || null, notes: body.notes || null, organizationId: orgId },
  });
  return NextResponse.json(item, { status: 201 });
}

