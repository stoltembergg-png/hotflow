import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, hashPassword } from "@/lib/auth";

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const sources = ['Instagram', 'Facebook', 'TikTok', 'Google', 'Telegram', 'Indicação', 'Orgânico', 'YouTube'];
const platforms = ['instagram', 'facebook', 'tiktok', 'google', 'telegram', 'x'];
const productNames = ['Curso Básico', 'Mentoria VIP', 'Pack Completo', 'E-book Digital', 'Assinatura Pro', 'Masterclass', 'Workshop', 'Coaching 1:1', 'Grupo Exclusivo', 'Template Pack'];
const productCategories = ['Curso', 'Mentoria', 'E-book', 'Assinatura', 'Template', 'Pack'];
const contentTypes = ['photo', 'video', 'reels', 'story', 'post', 'banner', 'text', 'audio'];
const contentStatuses = ['idea', 'production', 'ready', 'scheduled', 'published', 'archived'];
const taskTitles = ['Criar landing page', 'Gravar vídeo aula', 'Design de criativo', 'Escrever copy', 'Configurar pixel', 'Analisar métricas', 'Responder clientes', 'Atualizar CRM', 'Criar campanha', 'Revisar conteúdo', 'Planejar postagem', 'Configurar automação', 'Relatório semanal', 'Treinar equipe', 'Otimizar checkout'];
const expenseCategories = ['traffic', 'tools', 'team', 'platform', 'production', 'outros'];
const expenseDescriptions = ['Facebook Ads', 'Google Ads', 'Canva Pro', 'Hotmart', 'Freelancer designer', 'Hostinger', 'Mailchimp', 'Zoom Pro', 'Vercel', 'Stripe fees', 'CapCut Pro', 'Manutenção site', 'Freelancer editor', 'Licença software', 'Impulsionamento Instagram', 'Comunidade pagas', 'Treinamento', 'Equipamento', 'Internet', 'Energia'];
const campaignNames = ['Black Friday 2026', 'Lançamento Curso', 'Retargeting Instagram', 'TikTok Awareness', 'Google Ads - Brand', 'Telegram Growth', 'Facebook Leads', 'YouTube Pre-roll'];

async function seedDemoData(orgId: string) {
  // 10 products
  for (let i = 0; i < 10; i++) {
    const price = randomFloat(47, 1997);
    await prisma.product.create({
      data: { name: productNames[i], description: `Descrição do ${productNames[i]}`, category: randomItem(productCategories), price, promotionalPrice: randomFloat(price * 0.5, price * 0.9), status: 'active', type: i < 6 ? 'product' : i < 8 ? 'subscription' : 'bundle', organizationId: orgId },
    });
  }
  const allProducts = await prisma.product.findMany({ where: { organizationId: orgId } });
  function rp() { return randomItem(allProducts); }

  // 10 customers
  for (let i = 0; i < 10; i++) {
    await prisma.customer.create({
      data: { name: `Cliente ${i + 1}`, email: `cliente${i + 1}@email.com`, phone: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`, telegram: `@user${randomInt(1000, 9999)}`, status: randomItem(['active', 'active', 'vip', 'inactive', 'new']), source: randomItem(sources), organizationId: orgId },
    });
  }
  const allCustomers = await prisma.customer.findMany({ where: { organizationId: orgId } });
  function rc() { return randomItem(allCustomers); }

  // 30 orders
  for (let i = 0; i < 30; i++) {
    const product = rp();
    const customer = rc();
    const discount = randomFloat(0, product.price * 0.2);
    const fees = randomFloat(product.price * 0.02, product.price * 0.08);
    await prisma.order.create({
      data: { totalAmount: product.price, discount, fees, netAmount: product.price - discount - fees, paymentMethod: randomItem(['pix', 'pix', 'credit_card', 'credit_card', 'boleto']), status: randomItem(['paid', 'paid', 'paid', 'paid', 'pending', 'cancelled']), source: randomItem(sources), customerId: customer.id, productId: product.id, organizationId: orgId },
    });
  }

  // 15 leads
  const leadStages = ['new', 'contacted', 'interested', 'checkout', 'payment_pending', 'converted'];
  for (let i = 0; i < 15; i++) {
    await prisma.lead.create({
      data: { name: `Lead ${i + 1}`, contact: `lead${i + 1}@email.com`, source: randomItem(sources), campaign: randomItem(['Black Friday', 'Lançamento', 'Retargeting', 'Orgânico']), productInterest: randomItem(productNames), stage: randomItem(leadStages), potentialValue: randomFloat(47, 1997), organizationId: orgId },
    });
  }

  // 5 campaigns with metrics
  for (let i = 0; i < 5; i++) {
    const budget = randomFloat(500, 5000);
    const investment = randomFloat(budget * 0.3, budget);
    const c = await prisma.campaign.create({
      data: { name: campaignNames[i], platform: randomItem(platforms), objective: randomItem(['Vendas', 'Leads', 'Awareness', 'Tráfego']), budget, investment, status: i < 4 ? 'active' : 'paused', organizationId: orgId },
    });
    for (let j = 0; j < 7; j++) {
      await prisma.campaignMetric.create({
        data: { date: randomDate(new Date('2026-08-01'), new Date('2026-08-12')), impressions: randomInt(1000, 50000), clicks: randomInt(50, 2000), leads: randomInt(5, 100), conversions: randomInt(1, 30), revenue: randomFloat(100, 5000), spend: randomFloat(50, 500), campaignId: c.id },
      });
    }
  }

  // 10 content items
  for (let i = 0; i < 10; i++) {
    await prisma.content.create({
      data: { name: `Conteúdo ${i + 1} - ${randomItem(['Carrossel', 'Vídeo', 'Reels', 'Story', 'Post', 'Banner'])}`, contentType: randomItem(contentTypes), platform: randomItem(platforms), category: randomItem(['Marketing', 'Educacional', 'Entretenimento', 'Promocional']), status: randomItem(contentStatuses), publishDate: randomDate(new Date('2026-08-01'), new Date('2026-08-31')), caption: `Legenda do conteúdo ${i + 1}`, cta: randomItem(['Saiba mais', 'Compre agora', 'Clique aqui']), hashtags: '#hotflow #marketing', organizationId: orgId },
    });
  }

  // 8 expenses
  for (let i = 0; i < 8; i++) {
    await prisma.expense.create({
      data: { description: randomItem(expenseDescriptions), amount: randomFloat(10, 2000), category: randomItem(expenseCategories), date: randomDate(new Date('2026-07-01'), new Date('2026-08-12')), recurring: Math.random() > 0.7, organizationId: orgId },
    });
  }

  // 8 tasks
  for (let i = 0; i < 8; i++) {
    await prisma.task.create({
      data: { title: taskTitles[i % taskTitles.length], description: `Tarefa: ${taskTitles[i % taskTitles.length]}`, assignee: randomItem(['Admin', 'Carlos', 'Ana', 'Pedro']), priority: randomItem(['low', 'medium', 'medium', 'high', 'urgent']), dueDate: randomDate(new Date('2026-08-01'), new Date('2026-08-31')), status: randomItem(['todo', 'todo', 'in_progress', 'review', 'done']), project: randomItem(['Lançamento', 'Marketing', 'Operações', 'Conteúdo']), organizationId: orgId },
    });
  }

  // 3 subscriptions
  for (let i = 0; i < 3; i++) {
    const customer = rc();
    await prisma.subscription.create({
      data: { plan: randomItem(['Básico', 'Pro', 'Business']), amount: randomFloat(47, 297), status: randomItem(['active', 'active', 'cancelled']), startDate: randomDate(new Date('2026-01-01'), new Date('2026-08-01')), nextBilling: randomDate(new Date('2026-08-15'), new Date('2026-09-15')), customerId: customer.id, organizationId: orgId },
    });
  }

  // 5 traffic sources
  for (let i = 0; i < 5; i++) {
    const investment = randomFloat(100, 2000);
    const impressions = randomInt(1000, 100000);
    const clicks = randomInt(50, 5000);
    const leads = randomInt(5, 200);
    const conversions = randomInt(1, 50);
    const revenue = randomFloat(investment * 0.5, investment * 5);
    await prisma.trafficSource.create({
      data: { campaign: randomItem(campaignNames), platform: randomItem(platforms), adSet: `Conjunto ${i + 1}`, creative: `Criativo ${i + 1}`, investment, impressions, reach: randomInt(500, 50000), clicks, ctr: impressions > 0 ? (clicks / impressions) * 100 : 0, cpc: clicks > 0 ? investment / clicks : 0, leads, conversions, revenue, roas: investment > 0 ? revenue / investment : 0, cpa: conversions > 0 ? investment / conversions : 0, cpl: leads > 0 ? investment / leads : 0, roi: investment > 0 ? ((revenue - investment) / investment) * 100 : 0, organizationId: orgId },
    });
  }

  // Notifications
  const notificationMessages = [
    { title: 'Bem-vindo ao HOTFLOW!', message: 'Sua conta foi criada com sucesso. Comece cadastrando seus primeiros clientes.', type: 'system' },
    { title: 'Dica: Dashboard', message: 'O dashboard mostra suas métricas em tempo real. Configure seu primeiro produto!', type: 'system' },
  ];
  for (const notif of notificationMessages) {
    await prisma.notification.create({ data: { ...notif, read: false, organizationId: orgId } });
  }

  // Tags
  const tagNames = ['VIP', 'Recorrente', 'Novo', 'Inativo', 'Premium'];
  for (const name of tagNames) {
    await prisma.tag.create({ data: { name, color: randomItem(['#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#eab308']), organizationId: orgId } });
  }
}

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

    const org = await prisma.organization.create({ data: { name: orgName || `${name}'s Organization` } });

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "owner", organizationId: org.id },
      select: { id: true, name: true, email: true, role: true, organizationId: true, createdAt: true },
    });

    // Seed demo data for new org
    await seedDemoData(org.id);

    const token = generateToken({ userId: user.id, email: user.email, role: user.role, orgId: user.organizationId });

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