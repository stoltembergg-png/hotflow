import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";

  const now = new Date();
  const startDate = new Date();
  switch (period) {
    case "7d": startDate.setDate(now.getDate() - 7); break;
    case "30d": startDate.setDate(now.getDate() - 30); break;
    case "90d": startDate.setDate(now.getDate() - 90); break;
    default: startDate.setDate(now.getDate() - 30);
  }

  const [orders, customers, expenses, leads, campaigns, products, trafficSources, subscriptions] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startDate } }, include: { product: true } }),
    prisma.customer.findMany({ where: { createdAt: { gte: startDate } } }),
    prisma.expense.findMany({ where: { date: { gte: startDate } } }),
    prisma.lead.findMany({ where: { createdAt: { gte: startDate } } }),
    prisma.campaign.findMany({ include: { metrics: true } }),
    prisma.product.findMany(),
    prisma.trafficSource.findMany(),
    prisma.subscription.findMany(),
  ]);

  const paidOrders = orders.filter((o: any) => o.status === "paid");
  const totalRevenue = paidOrders.reduce((s: number, o: any) => s + (o.netAmount || o.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const profit = totalRevenue - totalExpenses;
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const conversion = orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;

  const activeSubs = subscriptions.filter((s: any) => s.status === "active");
  const mrr = activeSubs.reduce((s: number, sub: any) => s + (sub.amount || 0), 0);
  const activeCustomers = customers.filter((c: any) => c.status === "active" || c.status === "vip").length;

  // Traffic metrics
  const totalTrafficInvest = trafficSources.reduce((s: number, t: any) => s + (t.investment || 0), 0);
  const totalTrafficRevenue = trafficSources.reduce((s: number, t: any) => s + (t.revenue || 0), 0);
  const roas = totalTrafficInvest > 0 ? totalTrafficRevenue / totalTrafficInvest : 0;

  // Build time-series for faturamento chart (last N days, grouped by day)
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const faturamentoChart: { name: string; value: number }[] = [];
  const vendasChart: { name: string; vendas: number; meta: number }[] = [];
  const lucroChart: { name: string; receita: number; custo: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split("T")[0];
    const label = String(d.getDate()).padStart(2, "0");

    const dayOrders = paidOrders.filter((o: any) => o.createdAt.toISOString().split("T")[0] === dStr);
    const dayExpenses = expenses.filter((e: any) => e.date.toISOString().split("T")[0] === dStr);
    const dayRevenue = dayOrders.reduce((s: number, o: any) => s + (o.netAmount || o.totalAmount || 0), 0);
    const dayCost = dayExpenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);

    faturamentoChart.push({ name: label, value: dayRevenue });
    vendasChart.push({ name: label, vendas: dayOrders.length, meta: Math.ceil(days > 30 ? (paidOrders.length / days) * 1.2 : (paidOrders.length / days) * 1.2) });
    lucroChart.push({ name: label, receita: dayRevenue, custo: dayCost });
  }

  // Origem das vendas (by source field on orders)
  const sourceMap: Record<string, number> = {};
  paidOrders.forEach((o: any) => {
    const src = o.source || "Outros";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceColors: Record<string, string> = {
    "Instagram": "#f97316",
    "Facebook": "#3b82f6",
    "Google": "#a855f7",
    "Indicação": "#22c55e",
    "Orgânico": "#f97316",
    "YouTube": "#ec4899",
    "TikTok": "#06b6d4",
  };
  const totalSources = Object.values(sourceMap).reduce((a: number, b: number) => a + b, 0) || 1;
  const origemVendas = Object.entries(sourceMap).map(([name, count]) => ({
    name,
    value: Math.round((count / totalSources) * 100),
    color: sourceColors[name] || "#71717a",
  })).sort((a, b) => b.value - a.value).slice(0, 6);

  // Produtos top (by paid order count)
  const productSalesMap: Record<string, { name: string; vendas: number; revenue: number }> = {};
  paidOrders.forEach((o: any) => {
    const pid = o.productId || "unknown";
    const pname = o.product?.name || "Sem produto";
    if (!productSalesMap[pid]) productSalesMap[pid] = { name: pname, vendas: 0, revenue: 0 };
    productSalesMap[pid].vendas++;
    productSalesMap[pid].revenue += o.netAmount || o.totalAmount || 0;
  });
  const produtosTop = Object.values(productSalesMap)
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 6)
    .map(p => ({ name: p.name, vendas: p.vendas }));

  // Campanhas ROAS
  const campanhasRoas = campaigns
    .map((c: any) => {
      const invest = c.metrics?.reduce((s: number, m: any) => s + (m.spend || 0), 0) || 0;
      const revenue = c.metrics?.reduce((s: number, m: any) => s + (m.revenue || 0), 0) || 0;
      return { name: c.name, roas: invest > 0 ? parseFloat((revenue / invest).toFixed(1)) : 0 };
    })
    .sort((a: any, b: any) => b.roas - a.roas)
    .slice(0, 6);

  // Funnel
  const totalLeads = leads.length;
  const checkoutLeads = leads.filter((l: any) => ["checkout", "payment_pending", "converted"].includes(l.stage)).length;
  const paymentLeads = leads.filter((l: any) => ["payment_pending", "converted"].includes(l.stage)).length;
  const convertedLeads = leads.filter((l: any) => l.stage === "converted").length;
  const funnel = [
    { stage: "Leads", count: totalLeads, color: "#f97316" },
    { stage: "Checkout", count: checkoutLeads, color: "#fb923c" },
    { stage: "Pagamento", count: paymentLeads, color: "#fbbf24" },
    { stage: "Venda", count: paidOrders.length, color: "#22c55e" },
    { stage: "Cliente Recorrente", count: activeSubs.length, color: "#a855f7" },
  ];

  // Attention items
  const pendingPayments = orders.filter((o: any) => o.status === "pending").length;
  const lowRoasCampaigns = campaigns.filter((c: any) => {
    const invest = c.metrics?.reduce((s: number, m: any) => s + (m.spend || 0), 0) || 0;
    const revenue = c.metrics?.reduce((s: number, m: any) => s + (m.revenue || 0), 0) || 0;
    return invest > 0 && (revenue / invest) < 2.0;
  }).length;
  const expiringSubs = activeSubs.filter((s: any) => {
    if (!s.nextBilling) return false;
    const days = (new Date(s.nextBilling).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  }).length;
  const coldLeads = leads.filter((l: any) => ["new", "contacted"].includes(l.stage)).length;

  const metrics = [
    { label: "Faturamento", value: formatBRL(totalRevenue), change: 0, icon: "DollarSign", color: "text-orange-400", bgColor: "bg-orange-500/10" },
    { label: "Lucro Líquido", value: formatBRL(profit), change: 0, icon: "TrendingUp", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    { label: "Vendas", value: String(paidOrders.length), change: 0, icon: "ShoppingCart", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { label: "Ticket Médio", value: formatBRL(avgTicket), change: 0, icon: "Target", color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { label: "Leads", value: String(totalLeads), change: 0, icon: "UserPlus", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
    { label: "Conversão", value: `${conversion.toFixed(1)}%`, change: 0, icon: "Zap", color: "text-amber-400", bgColor: "bg-amber-500/10" },
    { label: "Investimento Tráfego", value: formatBRL(totalTrafficInvest), change: 0, icon: "Megaphone", color: "text-pink-400", bgColor: "bg-pink-500/10" },
    { label: "ROAS", value: `${roas.toFixed(1)}x`, change: 0, icon: "RotateCcw", color: "text-teal-400", bgColor: "bg-teal-500/10" },
    { label: "Clientes Ativos", value: String(activeCustomers), change: 0, icon: "Users", color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
    { label: "MRR", value: formatBRL(mrr), change: 0, icon: "BarChart3", color: "text-green-400", bgColor: "bg-green-500/10" },
  ];

  const attention = [
    ...(pendingPayments > 0 ? [{ id: "1", icon: "DollarSign", title: "Pagamentos Pendentes", description: `${pendingPayments} transação(ões) aguardando confirmação de pagamento`, count: pendingPayments, severity: "warning", action: "Verificar pagamentos" }] : []),
    ...(lowRoasCampaigns > 0 ? [{ id: "2", icon: "TrendingDown", title: "Queda em Campanhas", description: `${lowRoasCampaigns} campanha(s) com ROAS abaixo de 2.0`, count: lowRoasCampaigns, severity: "danger", action: "Revisar campanhas" }] : []),
    ...(coldLeads > 0 ? [{ id: "3", icon: "UserPlus", title: "Leads sem Conversão", description: `${coldLeads} leads sem interação recente no pipeline`, count: coldLeads, severity: "info", action: "Iniciar sequência" }] : []),
    ...(expiringSubs > 0 ? [{ id: "4", icon: "CreditCard", title: "Assinaturas para Expirar", description: `${expiringSubs} assinatura(s) vencendo nos próximos 7 dias`, count: expiringSubs, severity: "warning", action: "Campanha de retenção" }] : []),
  ];

  return NextResponse.json({
    metrics,
    faturamentoChart,
    vendasChart,
    lucroChart,
    origemVendas,
    produtosTop,
    campanhasRoas,
    funnel,
    attention,
  });
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}
