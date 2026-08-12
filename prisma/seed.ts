import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

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

const firstNames = ['Ana', 'Carlos', 'Juliana', 'Pedro', 'Maria', 'Lucas', 'Fernanda', 'Rafael', 'Camila', 'Bruno', 'Larissa', 'Thiago', 'Patrícia', 'Gabriel', 'Amanda', 'Mateus', 'Isabela', 'Felipe', 'Letícia', 'André', 'Beatriz', 'Diego', 'Natália', 'Leonardo', 'Priscila', 'Rodrigo', 'Vanessa', 'Eduardo', 'Tatiane', 'Marcos', 'Carla', 'Vinícius', 'Adriana', 'Daniel', 'Renata', 'Gustavo', 'Mariana', 'Henrique', 'Bianca', 'Alexandre', 'Daniela', 'Fábio', 'Cristina', 'Ricardo', 'Flávia', 'Sérgio', 'Luciana', 'Roberto', 'Simone', 'Maurício'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Rodrigues', 'Ferreira', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Barbosa', 'Ribeiro', 'Carvalho', 'Martins', 'Rocha', 'Correia', 'Gomes', 'Mendes', 'Moreira', 'Nunes', 'Vieira', 'Teixeira', 'Pereira', 'Castro', 'Lopes', 'Monteiro', 'Cardoso', 'Dias', 'Fernandes'];
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

async function main() {
  console.log('🌱 Seeding MongoDB...');

  // Clean all collections
  const collections = ['activity', 'customerTag', 'tag', 'notification', 'auditLog', 'expense', 'task', 'content', 'trafficSource', 'campaignMetric', 'campaign', 'subscription', 'order', 'offer', 'product', 'lead', 'customer', 'user', 'organization'];
  for (const col of collections) {
    try { await prisma.$runCommandRaw({ delete: col, deletes: [{ q: {}, limit: 0 }] }); } catch {}
  }

  const org = await prisma.organization.create({ data: { name: 'HOTFLOW Demo', currency: 'BRL', timezone: 'America/Sao_Paulo' } });

  await prisma.user.create({
    data: { name: 'Admin HOTFLOW', email: 'admin@hotflow.com', password: hashSync('123456', 10), role: 'owner', organizationId: org.id },
  });

  // 50 customers
  for (let i = 0; i < 50; i++) {
    await prisma.customer.create({
      data: {
        name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
        email: `cliente${i + 1}@email.com`,
        phone: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
        telegram: `@user${randomInt(1000, 9999)}`,
        status: randomItem(['active', 'active', 'active', 'vip', 'inactive', 'new']),
        source: randomItem(sources),
        organizationId: org.id,
      },
    });
  }

  // 10 products
  for (let i = 0; i < 10; i++) {
    const price = randomFloat(47, 1997);
    await prisma.product.create({
      data: { name: productNames[i], description: `Descrição do ${productNames[i]}`, category: randomItem(productCategories), price, promotionalPrice: randomFloat(price * 0.5, price * 0.9), status: 'active', type: i < 6 ? 'product' : i < 8 ? 'subscription' : 'bundle', organizationId: org.id },
    });
  }

  // Get all products and customers for references
  const allProducts = await prisma.product.findMany();
  const allCustomers = await prisma.customer.findMany();
  function rp() { return randomItem(allProducts); }
  function rc() { return randomItem(allCustomers); }

  // 100 orders
  for (let i = 0; i < 100; i++) {
    const product = rp();
    const customer = rc();
    const discount = randomFloat(0, product.price * 0.2);
    const fees = randomFloat(product.price * 0.02, product.price * 0.08);
    await prisma.order.create({
      data: { totalAmount: product.price, discount, fees, netAmount: product.price - discount - fees, paymentMethod: randomItem(['pix', 'pix', 'credit_card', 'credit_card', 'boleto']), status: randomItem(['paid', 'paid', 'paid', 'paid', 'pending', 'cancelled']), source: randomItem(sources), customerId: customer.id, productId: product.id, organizationId: org.id },
    });
  }

  // 30 leads
  const leadStages = ['new', 'contacted', 'interested', 'checkout', 'payment_pending', 'converted'];
  for (let i = 0; i < 30; i++) {
    await prisma.lead.create({
      data: { name: `${randomItem(firstNames)} ${randomItem(lastNames)}`, contact: `lead${i + 1}@email.com`, source: randomItem(sources), campaign: randomItem(['Black Friday', 'Lançamento', 'Retargeting', 'Orgânico']), productInterest: randomItem(productNames), stage: randomItem(leadStages), potentialValue: randomFloat(47, 1997), organizationId: org.id },
    });
  }

  // 8 campaigns
  for (let i = 0; i < 8; i++) {
    const budget = randomFloat(500, 5000);
    const investment = randomFloat(budget * 0.3, budget);
    const c = await prisma.campaign.create({
      data: { name: campaignNames[i], platform: randomItem(platforms), objective: randomItem(['Vendas', 'Leads', 'Awareness', 'Tráfego']), budget, investment, status: i < 6 ? 'active' : 'paused', organizationId: org.id },
    });
    for (let j = 0; j < 7; j++) {
      await prisma.campaignMetric.create({
        data: { date: randomDate(new Date('2026-08-01'), new Date('2026-08-12')), impressions: randomInt(1000, 50000), clicks: randomInt(50, 2000), leads: randomInt(5, 100), conversions: randomInt(1, 30), revenue: randomFloat(100, 5000), spend: randomFloat(50, 500), campaignId: c.id },
      });
    }
  }

  // 30 content items
  for (let i = 0; i < 30; i++) {
    await prisma.content.create({
      data: { name: `Conteúdo ${i + 1} - ${randomItem(['Carrossel', 'Vídeo', 'Reels', 'Story', 'Post', 'Banner'])}`, contentType: randomItem(contentTypes), platform: randomItem(platforms), category: randomItem(['Marketing', 'Educacional', 'Entretenimento', 'Promocional']), status: randomItem(contentStatuses), publishDate: randomDate(new Date('2026-08-01'), new Date('2026-08-31')), caption: `Legenda do conteúdo ${i + 1}`, cta: randomItem(['Saiba mais', 'Compre agora', 'Clique aqui']), hashtags: '#hotflow #marketing', organizationId: org.id },
    });
  }

  // 20 expenses
  for (let i = 0; i < 20; i++) {
    await prisma.expense.create({
      data: { description: randomItem(expenseDescriptions), amount: randomFloat(10, 2000), category: randomItem(expenseCategories), date: randomDate(new Date('2026-07-01'), new Date('2026-08-12')), recurring: Math.random() > 0.7, organizationId: org.id },
    });
  }

  // 15 tasks
  for (let i = 0; i < 15; i++) {
    await prisma.task.create({
      data: { title: taskTitles[i % taskTitles.length], description: `Tarefa: ${taskTitles[i % taskTitles.length]}`, assignee: randomItem(['Admin', 'Carlos', 'Ana', 'Pedro']), priority: randomItem(['low', 'medium', 'medium', 'high', 'urgent']), dueDate: randomDate(new Date('2026-08-01'), new Date('2026-08-31')), status: randomItem(['todo', 'todo', 'in_progress', 'review', 'done']), project: randomItem(['Lançamento', 'Marketing', 'Operações', 'Conteúdo']), organizationId: org.id },
    });
  }

  // 10 subscriptions
  for (let i = 0; i < 10; i++) {
    const customer = rc();
    await prisma.subscription.create({
      data: { plan: randomItem(['Básico', 'Pro', 'Business']), amount: randomFloat(47, 297), status: randomItem(['active', 'active', 'active', 'cancelled', 'expired']), startDate: randomDate(new Date('2026-01-01'), new Date('2026-08-01')), nextBilling: randomDate(new Date('2026-08-15'), new Date('2026-09-15')), customerId: customer.id, organizationId: org.id },
    });
  }

  // 12 traffic sources
  for (let i = 0; i < 12; i++) {
    const investment = randomFloat(100, 2000);
    const impressions = randomInt(1000, 100000);
    const clicks = randomInt(50, 5000);
    const leads = randomInt(5, 200);
    const conversions = randomInt(1, 50);
    const revenue = randomFloat(investment * 0.5, investment * 5);
    await prisma.trafficSource.create({
      data: { campaign: randomItem(campaignNames), platform: randomItem(platforms), adSet: `Conjunto ${i + 1}`, creative: `Criativo ${i + 1}`, investment, impressions, reach: randomInt(500, 50000), clicks, ctr: impressions > 0 ? (clicks / impressions) * 100 : 0, cpc: clicks > 0 ? investment / clicks : 0, leads, conversions, revenue, roas: investment > 0 ? revenue / investment : 0, cpa: conversions > 0 ? investment / conversions : 0, cpl: leads > 0 ? investment / leads : 0, roi: investment > 0 ? ((revenue - investment) / investment) * 100 : 0, organizationId: org.id },
    });
  }

  // Notifications
  const notificationMessages = [
    { title: 'Nova venda', message: 'Você recebeu uma nova venda de R$ 497,00', type: 'sale' },
    { title: 'Campanha em queda', message: 'A campanha "Black Friday" caiu 32% no CTR', type: 'campaign' },
    { title: 'Pagamentos pendentes', message: 'Existem 14 pagamentos pendentes', type: 'payment' },
    { title: 'Melhor produto', message: 'Seu melhor produto hoje foi Mentoria VIP', type: 'sale' },
    { title: 'Tarefas atrasadas', message: 'Você possui 5 tarefas atrasadas', type: 'task' },
    { title: 'Nova assinatura', message: 'Um novo cliente assinou o plano Pro', type: 'sale' },
    { title: 'Campanha atingiu meta', message: 'A campanha "Lançamento" atingiu a meta de ROAS', type: 'campaign' },
    { title: 'Sistema atualizado', message: 'O HOTFLOW foi atualizado com novos recursos', type: 'system' },
  ];
  for (const notif of notificationMessages) {
    await prisma.notification.create({ data: { ...notif, read: Math.random() > 0.5, organizationId: org.id } });
  }

  // Tags
  const tagNames = ['VIP', 'Recorrente', 'Novo', 'Inativo', 'Premium', 'Churn', 'Alto valor', 'Promotor'];
  for (const name of tagNames) {
    await prisma.tag.create({ data: { name, color: randomItem(['#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ef4444', '#eab308']), organizationId: org.id } });
  }

  console.log('✅ Seed completed!');
  console.log('   - 1 organization');
  console.log('   - 1 user (admin@hotflow.com / 123456)');
  console.log('   - 50 customers');
  console.log('   - 30 leads');
  console.log('   - 10 products');
  console.log('   - 100 orders');
  console.log('   - 8 campaigns with metrics');
  console.log('   - 30 content items');
  console.log('   - 20 expenses');
  console.log('   - 15 tasks');
  console.log('   - 10 subscriptions');
  console.log('   - 12 traffic sources');
  console.log('   - 8 notifications');
  console.log('   - 8 tags');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
