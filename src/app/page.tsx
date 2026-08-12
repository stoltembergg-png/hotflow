"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3, Users, Target, TrendingUp, CreditCard, FileText,
  Calendar, Zap, Shield, Globe, ChevronDown, ChevronRight,
  Check, ArrowRight, Star, Flame, Eye, PieChart, DollarSign,
  ShoppingCart, Megaphone, Settings, Layout, Sparkles, Crown,
  Menu, X
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a gerenciar sua operação",
    features: [
      "Dashboard básico",
      "CRM com até 50 clientes",
      "10 produtos",
      "5 campanhas",
      "Relatórios básicos",
      "1 usuário",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Para operações em crescimento",
    features: [
      "Tudo do Free",
      "CRM ilimitado",
      "Produtos ilimitados",
      "Campanhas ilimitadas",
      "Analytics avançado",
      "Relatórios completos",
      "Conteúdo e calendário",
      "Financeiro completo",
      "5 usuários",
      "Suporte prioritário",
    ],
    cta: "Escolher Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "R$ 297",
    period: "/mês",
    description: "Para equipes e operações avançadas",
    features: [
      "Tudo do Pro",
      "Equipe ilimitada",
      "Permissões avançadas",
      "Insights de IA",
      "API completa",
      "White-label",
      "Multi-workspace",
      "Auditoria avançada",
      "SLA garantido",
      "Suporte dedicado",
    ],
    cta: "Escolher Business",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Ana S.",
    role: "Criadora de conteúdo",
    text: "O HOTFLOW transformou minha operação. Consigo ver tudo em um só lugar — vendas, clientes, campanhas. Economizo horas por dia.",
    rating: 5,
  },
  {
    name: "Carlos M.",
    role: "Growth Manager",
    text: "Finalmente uma ferramenta que entende o fluxo completo. Do lead ao cliente, do conteúdo ao financeiro. Tudo conectado.",
    rating: 5,
  },
  {
    name: "Juliana R.",
    role: "Infoprodutora",
    text: "Os relatórios e analytics me dão clareza total sobre onde investir. O dashboard é incrível — parece ter um CFO trabalhando para mim.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Preciso de conhecimento técnico para usar?",
    a: "Não. O HOTFLOW foi criado para ser intuitivo. Qualquer pessoa consegue cadastrar clientes, produtos, campanhas e acompanhar tudo pelo dashboard.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Utilizamos criptografia, autenticação por token e isolamento completo de dados entre workspaces. Cada operação tem seu próprio ambiente seguro.",
  },
  {
    q: "Posso integrar com minhas ferramentas atuais?",
    a: "Sim. O HOTFLOW suporta integração com principais plataformas de tráfego, pagamento e conteúdo. Na versão Business, temos API completa.",
  },
  {
    q: "Tem app mobile?",
    a: "O HOTFLOW é responsivo e funciona perfeitamente em qualquer dispositivo — desktop, tablet ou celular. Não é necessário instalar nada.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Sem fidelidade. Cancele a qualquer momento pelo painel de configurações. Você mantém acesso ao final do período pago.",
  },
  {
    q: "Vocês oferecem suporte?",
    a: "Sim. Usuários Free têm suporte por e-mail. Pro têm suporte prioritário. Business têm suporte dedicado com SLA garantido.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Flame className="w-7 h-7 text-orange-500" />
              <span className="text-xl font-bold gradient-text">HOTFLOW</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition">Funcionalidades</a>
              <a href="#dashboard" className="text-sm text-zinc-400 hover:text-zinc-100 transition">Dashboard</a>
              <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition">Preços</a>
              <a href="#faq" className="text-sm text-zinc-400 hover:text-zinc-100 transition">FAQ</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition">
                Entrar
              </Link>
              <Link href="/auth/register" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-orange-500/20">
                Começar Grátis
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/50 p-4 space-y-3">
            <a href="#features" className="block text-sm text-zinc-400 hover:text-zinc-100">Funcionalidades</a>
            <a href="#pricing" className="block text-sm text-zinc-400 hover:text-zinc-100">Preços</a>
            <a href="#faq" className="block text-sm text-zinc-400 hover:text-zinc-100">FAQ</a>
            <hr className="border-zinc-800" />
            <Link href="/auth/login" className="block text-sm text-zinc-400 hover:text-zinc-100">Entrar</Link>
            <Link href="/auth/register" className="block px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg text-center">
              Começar Grátis
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-orange-400 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Plataforma de gestão para operações digitais
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Sua operação. Seus números.
            <br />
            <span className="gradient-text">Tudo em um só lugar.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Centralize vendas, clientes, campanhas, conteúdo e financeiro em uma plataforma moderna e poderosa. Tome decisões baseadas em dados reais.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-orange-500/25 flex items-center gap-2 text-base"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 border border-zinc-700 hover:border-zinc-600 text-zinc-300 font-medium rounded-xl transition-all text-base"
            >
              Ver Funcionalidades
            </a>
          </div>
          <p className="text-xs text-zinc-600 mt-4">Sem cartão de crédito. Plano Free disponível.</p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Dashboard <span className="gradient-text">Intuitivo</span></h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Visualize todas as suas métricas em tempo real. Faturamento, lucro, vendas, conversão — tudo na palma da mão.</p>
          </div>
          <div className="glass-card p-1 rounded-2xl overflow-hidden">
            <div className="bg-[#0f0f12] rounded-xl p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Faturamento Mês", value: "R$ 47.832", change: "+23.5%", up: true },
                  { label: "Lucro Líquido", value: "R$ 28.491", change: "+18.2%", up: true },
                  { label: "Vendas", value: "342", change: "+12.8%", up: true },
                  { label: "ROAS", value: "4.2x", change: "-2.1%", up: false },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className={`text-xs mt-1 ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 h-40">
                  <p className="text-xs text-zinc-500 mb-2">Faturamento</p>
                  <div className="flex items-end gap-1 h-24">
                    {[40, 55, 45, 65, 50, 75, 60, 85, 70, 90, 80, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-orange-500/20 rounded-sm relative group">
                        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-sm transition-all" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 h-40">
                  <p className="text-xs text-zinc-500 mb-2">Vendas por Origem</p>
                  <div className="flex items-center justify-center h-24">
                    <div className="w-20 h-20 rounded-full border-[6px] border-orange-500 border-r-green-500 border-b-blue-500 border-l-purple-500 relative">
                      <div className="absolute inset-2 bg-zinc-900/50 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">342</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 h-40">
                  <p className="text-xs text-zinc-500 mb-2">Campanhas Ativas</p>
                  <div className="space-y-2 mt-2">
                    {[
                      { name: "Black Friday", roas: "5.2x" },
                      { name: "Lançamento", roas: "3.8x" },
                      { name: "Retargeting", roas: "4.1x" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{c.name}</span>
                        <span className="text-green-400 font-medium">{c.roas}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tudo que você precisa para <span className="gradient-text">escalar</span></h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Módulos completos que cobrem cada etapa da sua operação digital.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: "Dashboard Completo", desc: "Métricas, gráficos, funis e insights em tempo real para tomada de decisão." },
              { icon: Users, title: "CRM Avançado", desc: "Gestão completa de clientes com perfil, histórico, tags e pipeline de leads." },
              { icon: ShoppingCart, title: "Vendas & Produtos", desc: "Registre vendas, gerencie produtos, ofertas, bundles e assinaturas." },
              { icon: Megaphone, title: "Campanhas", desc: "Gerencie campanhas em todas as plataformas com ROAS, CPA e conversões." },
              { icon: Target, title: "Tráfego Pago", desc: "Registre e compare investimento, CTR, CPC, CPL e ROI entre campanhas." },
              { icon: FileText, title: "Conteúdo", desc: "Central de conteúdo com calendário editorial, status e agendamento." },
              { icon: CreditCard, title: "Financeiro", desc: "Receitas, despesas, lucro, fluxo de caixa e categorização completa." },
              { icon: TrendingUp, title: "Analytics", desc: "Métricas avançadas com comparação de períodos e KPIs detalhados." },
              { icon: Shield, title: "Recuperação", desc: "PIX pendente, checkout abandonado, clientes inativos — tudo organizado." },
              { icon: Calendar, title: "Calendário", desc: "Visão mensal, semanal e diária dos seus conteúdos e publicações." },
              { icon: Zap, title: "Insights Automáticos", desc: "O sistema analisa seus dados e gera observações acionáveis." },
              { icon: Layout, title: "Multi-tenant", desc: "Cada workspace isolado. Segurança, permissões e escalabilidade SaaS." },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 group">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition">
                  <f.icon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, value: "10.000+", label: "Vendas gerenciadas" },
              { icon: Users, value: "5.000+", label: "Clientes ativos" },
              { icon: DollarSign, value: "R$ 2M+", label: "Faturamento processado" },
            ].map((s, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <s.icon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <p className="text-3xl font-bold gradient-text mb-1">{s.value}</p>
                <p className="text-sm text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-600 mt-4">* Dados de demonstração</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">O que dizem nossos <span className="gradient-text">usuários</span></h2>
            <p className="text-xs text-zinc-500">* Depoimentos fictícios para demonstração</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planos simples e <span className="gradient-text">transparentes</span></h2>
            <p className="text-zinc-400">Escolha o plano ideal para sua operação.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`glass-card p-6 relative ${plan.popular ? 'border-orange-500/50 shadow-lg shadow-orange-500/5' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block w-full py-2.5 text-center text-sm font-medium rounded-lg transition-all ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-600 mt-4">* Planos de demonstração. Cobrança real requer integração de pagamento.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perguntas <span className="gradient-text">frequentes</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10" />
            <div className="relative z-10">
              <Crown className="w-12 h-12 text-orange-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto para transformar sua operação?</h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Comece agora mesmo. Configure em minutos. Sem cartão de crédito.</p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-orange-500/25"
              >
                Criar Minha Conta Grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold gradient-text">HOTFLOW</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs text-zinc-500 hover:text-zinc-300 transition">Funcionalidades</a>
              <a href="#pricing" className="text-xs text-zinc-500 hover:text-zinc-300 transition">Preços</a>
              <a href="#faq" className="text-xs text-zinc-500 hover:text-zinc-300 transition">FAQ</a>
            </div>
            <p className="text-xs text-zinc-600">© 2026 HOTFLOW. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
