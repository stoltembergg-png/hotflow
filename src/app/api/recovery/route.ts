import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // PIX pendente - orders com status pending criados nos últimos 7 dias
  const pixPending = await prisma.order.findMany({
    where: { organizationId: orgId, status: "pending", createdAt: { gte: sevenDaysAgo } },
    include: { customer: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  // Checkout abandonado - orders com status pending mas sem customer (ou leads no stage checkout sem order)
  const abandonedCheckouts = await prisma.lead.findMany({
    where: { organizationId: orgId, stage: "checkout", updatedAt: { gte: sevenDaysAgo } },
    orderBy: { updatedAt: "desc" },
  });

  // Clientes inativos - sem orders pagos nos últimos 90 dias
  const recentPaidCustomers = await prisma.order.findMany({
    where: { organizationId: orgId, status: "paid", createdAt: { gte: thirtyDaysAgo } },
    select: { customerId: true },
  });
  const recentCustomerIds = new Set(recentPaidCustomers.map((o: any) => o.customerId).filter(Boolean));
  const inactiveCustomers = await prisma.customer.findMany({
    where: { organizationId: orgId, status: { in: ["active", "vip"] }, id: { notIn: Array.from(recentCustomerIds) } },
    orderBy: { updatedAt: "asc" },
    take: 20,
  });

  // Assinaturas vencendo nos próximos 14 dias
  const fourteenDaysLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const expiringSubs = await prisma.subscription.findMany({
    where: { organizationId: orgId, status: "active", nextBilling: { gte: now, lte: fourteenDaysLater } },
    include: { customer: true },
    orderBy: { nextBilling: "asc" },
  });

  const recovery = [
    ...pixPending.map((o: any) => ({
      id: o.id,
      customer: o.customer?.name || "Cliente",
      product: o.product?.name || "Produto",
      value: o.totalAmount || 0,
      date: o.createdAt.toISOString().split("T")[0],
      status: "pix_pending",
      lastActivity: o.updatedAt.toISOString().split("T")[0],
      priority: "high",
    })),
    ...abandonedCheckouts.map((l: any) => ({
      id: l.id,
      customer: l.name,
      product: l.productInterest || "Sem produto",
      value: l.potentialValue || 0,
      date: l.createdAt.toISOString().split("T")[0],
      status: "checkout_abandoned",
      lastActivity: l.updatedAt.toISOString().split("T")[0],
      priority: "high",
    })),
    ...inactiveCustomers.map((c: any) => ({
      id: c.id,
      customer: c.name,
      product: "N/A",
      value: 0,
      date: c.createdAt.toISOString().split("T")[0],
      status: "inactive",
      lastActivity: c.updatedAt.toISOString().split("T")[0],
      priority: "medium",
    })),
    ...expiringSubs.map((s: any) => ({
      id: s.id,
      customer: s.customer?.name || "Cliente",
      product: `Plano ${s.plan}`,
      value: s.amount || 0,
      date: s.startDate.toISOString().split("T")[0],
      status: "subscription_expiring",
      lastActivity: s.nextBilling?.toISOString().split("T")[0] || "",
      priority: "medium",
    })),
  ];

  // Sort by priority: high > medium > low, then by date desc
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  recovery.sort((a, b) => {
    const pa = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const pb = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    if (pa !== pb) return pb - pa;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return NextResponse.json({ data: recovery });
}