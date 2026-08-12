import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  if (q.length < 2) return Response.json({ results: [] });
  const search = { contains: q };
  const [customers, leads, products, orders, campaigns, content, tasks] = await Promise.all([
    prisma.customer.findMany({ where: { OR: [{ name: search }, { email: search }] }, take: 5 }),
    prisma.lead.findMany({ where: { OR: [{ name: search }, { contact: search }] }, take: 5 }),
    prisma.product.findMany({ where: { name: search }, take: 5 }),
    prisma.order.findMany({ take: 5 }),
    prisma.campaign.findMany({ where: { name: search }, take: 5 }),
    prisma.content.findMany({ where: { name: search }, take: 5 }),
    prisma.task.findMany({ where: { title: search }, take: 5 }),
  ]);
  return Response.json({
    results: [
      ...customers.map((c: any) => ({ type: 'customer', id: c.id, title: c.name, subtitle: c.email, url: '/dashboard/crm/clientes' })),
      ...leads.map((l: any) => ({ type: 'lead', id: l.id, title: l.name, subtitle: l.contact || '', url: '/dashboard/crm/leads' })),
      ...products.map((p: any) => ({ type: 'product', id: p.id, title: p.name, subtitle: p.type || '', url: '/dashboard/crm/produtos' })),
      ...orders.map((o: any) => ({ type: 'order', id: o.id, title: `Pedido #${o.id.slice(0, 8)}`, subtitle: o.status || '', url: '/dashboard/crm/vendas' })),
      ...campaigns.map((c: any) => ({ type: 'campaign', id: c.id, title: c.name, subtitle: c.platform || '', url: '/dashboard/marketing/campanhas' })),
      ...content.map((c: any) => ({ type: 'content', id: c.id, title: c.name, subtitle: c.contentType || '', url: '/dashboard/conteudo/conteudo' })),
      ...tasks.map((t: any) => ({ type: 'task', id: t.id, title: t.title, subtitle: t.status || '', url: '/dashboard/gestao/tarefas' })),
    ],
  });
}
