# HOTFLOW

Plataforma SaaS all-in-one para gestão de vendas, marketing, conteúdo e financeiro.
Multi-tenant, com isolamento completo de dados por organização.

## Stack

| Tecnologia | Versão |
|---|---|
| Next.js | 16.3.0 |
| React | 19.2 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Prisma | 5.22 |
| MongoDB Atlas | 7 |
| Zustand | 5 |
| React Hook Form | 7 |
| Zod | 4 |
| Recharts | 3 |
| Lucide Icons | 1.31 |

## Estrutura

```
src/
├── app/
│   ├── (dashboard)/          # Paginas autenticadas (layout + auth guard)
│   │   ├── dashboard/        # Visão geral com metricas em tempo real
│   │   ├── analytics/        # Graficos de trafego e conversao
│   │   ├── crm/
│   │   │   ├── clientes/     # Lista e detalhes de clientes
│   │   │   ├── leads/        # Pipeline de leads por stage
│   │   │   ├── vendas/       # Pedidos e status
│   │   │   ├── produtos/     # Catalogo de produtos
│   │   │   ├── ofertas/      # Ofertas ativas
│   │   │   └── assinaturas/  # Assinaturas recorrentes (MRR)
│   │   ├── marketing/
│   │   │   ├── campanhas/    # Campanhas com ROAS
│   │   │   └── trafego/      # Fontes de trafego pago
│   │   ├── conteudo/
│   │   │   ├── conteudo/     # Gestao de conteudo
│   │   │   ├── calendario/   # Calendario editorial
│   │   │   └── criativos/    # Criativos com metricas
│   │   ├── financeiro/
│   │   │   ├── financeiro/   # Receitas, despesas, lucro
│   │   │   └── recuperacao/  # PIX pendentes, checkout abandonado
│   │   ├── gestao/
│   │   │   ├── tarefas/      # Tarefas da equipe
│   │   │   ├── equipe/       # Membros da equipe
│   │   │   ├── notificacoes/ # Central de notificacoes
│   │   │   └── relatorios/   # Relatorios exportaveis
│   │   └── configuracoes/   # Perfil, seguranca, temas, notificacoes
│   ├── auth/
│   │   ├── login/            # Login com JWT
│   │   ├── register/         # Registro cria org + dados demo
│   │   └── forgot-password/  # Recuperacao de senha
│   ├── api/                  # 23 endpoints REST (ver secao API)
│   └── page.tsx              # Landing page
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx       # Sidebar retratil (logo = toggle)
│   │   ├── header.tsx        # Header com busca e notificacoes
│   │   ├── global-search.tsx # Cmd+K busca global
│   │   ├── notifications-panel.tsx
│   │   └── theme-provider.tsx
│   └── ui/                   # 21 componentes (button, card, etc)
├── lib/
│   ├── auth.ts               # hashPassword, verifyPassword, signToken, verifyToken
│   ├── auth-utils.ts         # requireAuth() helper para APIs
│   ├── prisma.ts             # Singleton Prisma client
│   └── utils.ts              # cn(), formatCurrency(), formatNumber(), etc
├── store/
│   └── auth-store.ts         # Zustand store para auth
└── app/globals.css           # 6 temas via CSS variables
```

## API

Todos os 23 endpoints filtram por `organizationId` extraido do JWT via `requireAuth()`.

| Endpoint | Metodo | Descricao |
|---|---|---|
| `/api/auth/login` | POST | Login, retorna JWT httpOnly cookie |
| `/api/auth/register` | POST | Cria org + usuario + dados demo |
| `/api/auth/me` | GET | Dados do usuario logado |
| `/api/dashboard` | GET | Metricas em tempo real por org |
| `/api/analytics` | GET | Dados de trafego e conversao |
| `/api/customers` | GET | Lista de clientes |
| `/api/leads` | GET | Leads por stage |
| `/api/orders` | GET | Pedidos e status de pagamento |
| `/api/products` | GET | Catalogo de produtos |
| `/api/offers` | GET | Ofertas ativas |
| `/api/subscriptions` | GET | Assinaturas e MRR |
| `/api/campaigns` | GET | Campanhas com ROAS |
| `/api/content` | GET | Posts e conteudo |
| `/api/creatives` | GET | Criativos com metricas |
| `/api/traffic` | GET | Fontes de trafego |
| `/api/expenses` | GET | Despesas por categoria |
| `/api/recovery` | GET | PIX pendentes + checkout abandonado |
| `/api/tasks` | GET | Tarefas da equipe |
| `/api/team` | GET | Membros da equipe |
| `/api/notifications` | GET, PATCH, DELETE | CRUD de notificacoes |
| `/api/reports` | GET | Relatorios agregados |
| `/api/search` | GET | Busca global (clientes, leads, etc) |
| `/api/settings` | GET, PATCH | Perfil + alterar senha |

## Modelos do Banco (Prisma)

17 modelos MongoDB com relacao `organizationId`:

`Organization`, `User`, `Customer`, `Lead`, `Product`, `Offer`, `Order`, `Subscription`, `Campaign`, `TrafficSource`, `Content`, `Task`, `Expense`, `Notification`, `AuditLog`, `Tag`, `Activity`

## Sistema de Temas

6 temas via CSS variables + `data-theme` no `<html>`:

| Tema | Fundo | Acento |
|---|---|---|
| Dark (padrao) | `#030712` | Laranja |
| Midnight | `#0a0e1a` | Indigo |
| Ocean | `#0c1222` | Sky |
| Forest | `#0a120e` | Verde |
| Sunset | `#1a0a0a` | Rosa |
| Light | `#f8fafc` | Laranja |

Tema salvo em `localStorage`, aplicado via `ThemeProvider`.

## Design System

- **Icones:** Lucide (zero emoji)
- **Cards:** Glassmorphism com `var(--surface)` + `backdrop-blur`
- **Scrollbars:** 4px invisivel ate hover
- **Animacoes:** `fadeIn`, `slideUp`, `scaleIn`, staggered em listas
- **Transicoes:** `cubic-bezier(0.22,1,0.36,1)` (sidebar, modals)
- **Sidebar:** Logo e toggle (hover revela botao), 64px collapsed / 240px expanded
- **Busca:** Cmd+K, cookie + Bearer token, navegacao por teclado

## Multi-tenant

- Cada usuario pertence a uma `Organization`
- JWT contem `userId`, `orgId`, `role`
- Todas as APIs usam `requireAuth()` que extrai `orgId` e filtra
- Registro cria org + dados de demonstracao unicos
- Contas diferentes veem dados completamente isolados

## Desenvolvimento

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Acesse http://localhost:3000

### Credenciais de teste (seed)

- **Email:** admin@hotflow.com
- **Senha:** 123456

## Variaveis de Ambiente

Copie `.env.example` para `.env` e ajuste:

| Variavel | Descricao |
|---|---|
| `DATABASE_URL` | String de conexao MongoDB (local ou Atlas) |
| `JWT_SECRET` | Secret do JWT (gerar com `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | Expiracao do token (default: `7d`) |

## Scripts

| Script | Acao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `prisma generate && next build` |
| `npm run start` | Servidor de producao |
| `npm run lint` | ESLint (0 erros, warnings permitidos) |
| `npm run db:generate` | Gerar cliente Prisma |
| `npm run db:push` | Sincronizar schema com banco |
| `npm run db:seed` | Popular banco com dados de exemplo |
| `npm run db:reset` | Resetar banco + reseed |
| `npm run db:studio` | Prisma Studio |

## CI/CD

- **CI:** GitHub Actions (`lint` + `typecheck` + `build`)
- **Deploy:** Vercel (producao)
- **URL:** https://hotflow-two.vercel.app
- **Build:** `prisma generate && next build` (necessario para Prisma Client)

## Polimorfismo de Dados

| Pagina | Fonte |
|---|---|
| Dashboard | API real (`/api/dashboard`) |
| Analytics | API real (`/api/analytics`) |
| CRM (todas) | API real por org |
| Marketing (campanhas, trafego) | API real por org |
| Conteudo (todas) | API real por org |
| Financeiro (financeiro, recuperacao) | API real por org + `/api/recovery` |
| Gestao (todas) | API real por org |
| Configuracoes | API real (`/api/settings`) |
| Notificacoes | API real (CRUD completo) |
| Busca global | API real (`/api/search`) |

**Zero dados mockados.** Todas as paginas consomem APIs reais com queries Prisma filtradas por `organizationId`.

## Roadmap de PRs

| PR | Descricao | Status |
|---|---|---|
| PR-001 | Corrigir cores hardcoded (bg-zinc-800/900) para theme-aware | Pendente |
| PR-002 | Endpoint `/api/auth/forgot-password` | Pendente |
| PR-003 | Pagina forgot-password funcional | Pendente |
| PR-004 | Corrigir warnings exhaustive-deps | Pendente |
| PR-005 | Pagina 404 customizada | Pendente |
