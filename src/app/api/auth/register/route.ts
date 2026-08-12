import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, orgName } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const org = await prisma.organization.create({
      data: { name: orgName || `${name}'s Organization` },
    });

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "owner",
        organizationId: org.id,
      },
      select: { id: true, name: true, email: true, role: true, organizationId: true, createdAt: true },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
    });

    const response = NextResponse.json({ user, token }, { status: 201 });
    response.cookies.set("hotflow-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
