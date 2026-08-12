import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const search = { contains: q, mode: "insensitive" as const };

  const [customers, leads, products, orders, campaigns, content, tasks] =
    await Promise.all([
      prisma.customer.findMany({
        where: { organizationId: orgId, OR: [{ name: search }, { email: search }] },
        take: 5,
      }),
      prisma.lead.findMany({
        where: { organizationId: orgId, OR: [{ name: search }, { contact: search }] },
        take: 5,
      }),
      prisma.product.findMany({
        where: { organizationId: orgId, name: search },
        take: 5,
      }),
      prisma.order.findMany({
        where: { organizationId: orgId },
        take: 5,
        include: { customer: true },
      }),
      prisma.campaign.findMany({
        where: { organizationId: orgId, name: search },
        take: 5,
      }),
      prisma.content.findMany({
        where: { organizationId: orgId, name: search },
        take: 5,
      }),
      prisma.task.findMany({
        where: { organizationId: orgId, title: search },
        take: 5,
      }),
    ]);

  return NextResponse.json({
    results: [
      ...customers.map((c: any) => ({
        type: "customer",
        id: c.id,
        title: c.name,
        subtitle: c.email || "",
        href: "/crm/clientes",
      })),
      ...leads.map((l: any) => ({
        type: "lead",
        id: l.id,
        title: l.name,
        subtitle: l.contact || l.email || "",
        href: "/crm/leads",
      })),
      ...products.map((p: any) => ({
        type: "product",
        id: p.id,
        title: p.name,
        subtitle: p.type || "",
        href: "/crm/produtos",
      })),
      ...orders.map((o: any) => ({
        type: "order",
        id: o.id,
        title: `Pedido #${o.id.slice(0, 8)}`,
        subtitle: o.customer?.name || o.status || "",
        href: "/crm/vendas",
      })),
      ...campaigns.map((c: any) => ({
        type: "campaign",
        id: c.id,
        title: c.name,
        subtitle: c.platform || "",
        href: "/marketing/campanhas",
      })),
      ...content.map((c: any) => ({
        type: "content",
        id: c.id,
        title: c.name,
        subtitle: c.contentType || "",
        href: "/conteudo/conteudo",
      })),
      ...tasks.map((t: any) => ({
        type: "task",
        id: t.id,
        title: t.title,
        subtitle: t.status || "",
        href: "/gestao/tarefas",
      })),
    ],
  });
}