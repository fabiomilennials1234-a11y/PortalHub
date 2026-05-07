# PortalHub

Plataforma all-in-one de comunidades + cursos online. Substitui Discord + Hotmart + Zoom com experiência unificada, gamificação nativa e UX world-class.

## Stack

- **Framework:** Next.js 16 (App Router, RSC, Server Actions) + React 19
- **Banco:** Supabase (PostgreSQL 15+, Auth, Realtime, Storage)
- **UI:** Tailwind CSS 4 + shadcn/ui (base-nova) + Framer Motion
- **State:** TanStack Query v5 (server) + Zustand (client)
- **Editor:** Tiptap (JSON em JSONB)
- **Pagamentos:** Stripe (Checkout + Billing Portal + Webhooks)
- **Email:** Resend
- **Testes:** Vitest (unit) + Playwright (e2e)
- **Deploy:** Vercel (recomendado), Docker (local)

## Features

| Domínio | Status |
|---------|--------|
| Auth (email/password, magic link, Google OAuth) | ✅ |
| Profiles + Organizations + Memberships (RLS) | ✅ |
| Community feed (posts, comments, reactions, categorias) | ✅ |
| Courses (módulos, lições, vídeo, texto, progresso) | ✅ |
| Gamification (pontos, níveis, achievements, leaderboard) | ✅ |
| Payments (planos, checkout, billing portal, webhook) | ✅ |
| Events (RSVP, status lifecycle) | ✅ |
| Notifications (Realtime via Supabase channels) | ✅ |
| Moderation (reports, queue admin) | ✅ |

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copiar `.env.example` para `.env.local` e preencher:

```bash
cp .env.example .env.local
```

Variáveis necessárias:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `SUPABASE_SERVICE_ROLE_KEY` — para webhooks (bypassa RLS)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe
- `RESEND_API_KEY` — emails transacionais
- `NEXT_PUBLIC_APP_URL` — URL pública da aplicação

### 3. Subir Supabase local (opcional)

```bash
docker-compose up -d
```

Studio UI: http://localhost:54323

### 4. Rodar migrations

Migrations em `supabase/migrations/` rodam automaticamente em ordem cronológica via `supabase db reset` (CLI) ou `mcp__plugin_supabase_supabase__apply_migration`.

### 5. Iniciar dev server

```bash
npm run dev
```

App: http://localhost:3000

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Servir build de produção |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npx vitest run` | Testes unit |
| `npx playwright test` | Testes E2E |

## Estrutura

```
src/
├── app/                    Next.js App Router
│   ├── (auth)/            login, signup, callback OAuth
│   ├── (marketing)/       landing pages públicas
│   ├── (platform)/        rotas autenticadas
│   │   ├── [orgSlug]/     contexto de organização
│   │   └── account/       perfil global do usuário
│   └── api/               webhooks (Stripe)
├── components/            UI por domínio (community, courses, ...)
├── actions/               Server Actions (mutations)
├── hooks/                 TanStack Query hooks
├── lib/
│   ├── supabase/          clients (server, browser, admin)
│   └── stripe/            client + helpers
├── types/                 database.types.ts + domain.ts
supabase/migrations/       schema SQL versionado
tests/
├── unit/                  Vitest
└── e2e/                   Playwright
```

## Convenções

Ver `.specs/codebase/CONVENTIONS.md`. Resumo:

- TypeScript strict. Sem `any`.
- Server Components por default. `"use client"` só com justificativa.
- Server Actions pra mutations. API Routes só pra webhooks.
- TanStack Query (server state) + Zustand (client state).
- React Hook Form + Zod pra forms.
- Tailwind. Sem CSS files. Dark-first.
- RLS obrigatório em toda tabela. ENABLE + FORCE + policy.
- `org_id` do contexto auth (RLS). Nunca do request.
- Conventional commits em PT-BR (`feat(web): ...`, `fix(api): ...`).

## Sprints entregues

7 sprints sequenciais, todas merged em `develop` com testes passando:

0. Foundation + Design System
1. Auth + Profiles + Orgs
2. Community Feed
3. Courses
4. Gamification
5. Payments
6. Events + Notifications + Moderation
7. Polish + QA + Launch

Detalhes: `.specs/project/STATE.md`.

## Licença

Proprietário. Todos os direitos reservados.
