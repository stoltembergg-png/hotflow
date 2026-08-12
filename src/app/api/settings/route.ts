import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      organization: { select: { name: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();

  // Password change
  if (body.currentPassword && body.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
    }

    const hashed = await hashPassword(body.newPassword);
    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: "Senha alterada com sucesso" });
  }

  // Profile update
  const data: Record<string, string> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum dado para atualizar" }, { status: 400 });
  }

  // Check email uniqueness
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, id: { not: auth.userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Email ja esta em uso" }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: auth.userId },
    data,
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user: updated });
}