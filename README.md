# HOTFLOW

Plataforma SaaS all-in-one para gestao de vendas, marketing, conteudo e financeiro.

## Stack

- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS 4
- Prisma 5 + MongoDB
- Zustand + React Hook Form + Zod
- Recharts

## Desenvolvimento

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Acesse http://localhost:3000

## Variaveis de Ambiente

Copie `.env.example` para `.env` e ajuste:

| Variavel | Descricao |
|---|---|
| `DATABASE_URL` | String de conexao MongoDB |
| `JWT_SECRET` | Secret do JWT (gerar com `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | Expiracao do token (default: `7d`) |

## Scripts

| Script | Acao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Servidor de producao |
| `npm run lint` | ESLint |
| `npm run db:generate` | Gerar cliente Prisma |
| `npm run db:push` | Sincronizar schema com banco |
| `npm run db:seed` | Popular banco com dados de exemplo |
| `npm run db:studio` | Prisma Studio |

## Deploy

O projeto esta configurado para deploy automatico na Vercel.
