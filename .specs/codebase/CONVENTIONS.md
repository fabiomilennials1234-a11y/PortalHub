# PortalHub — Convencoes de Codigo

## TypeScript

- `strict: true` — sem exceptions
- Prefer `interface` over `type` pra objetos
- Zod schema como source of truth pra validacao
- Nao usar `any`. Usar `unknown` se necessario.
- Imports via `@/` alias

## Next.js

- App Router only (sem pages/)
- Server Components por padrao. Client Components (`"use client"`) so quando necessario (interatividade, hooks, browser APIs)
- Server Actions pra mutations autenticadas
- API Routes so pra webhooks e logica que nao cabe em Server Actions
- `revalidatePath()` apos mutations pra invalidar cache
- Middleware pra auth guard e org resolution
- `next/image` pra todas as imagens
- Dynamic imports pra componentes pesados (rich text editor, charts)

## Supabase

- @supabase/ssr pra criar clients (browser, server, middleware)
- NUNCA usar supabase-js diretamente em Server Components — usar createServerClient
- RLS OBRIGATORIO em toda tabela de dominio: ENABLE + FORCE + policy
- Migrations SQL puro em `supabase/migrations/`. Formato: `YYYYMMDDHHMMSS_descricao.sql`
- Edge Functions em `supabase/functions/` — Deno runtime
- Storage buckets: `avatars` (public), `attachments` (private com RLS)
- Realtime: channel-based, scoped por org_id. Max 3 subscriptions por pagina.

## React

- TanStack Query v5 pra server state. Sem useState pra dados do servidor.
- Zustand pra client-only state (modals, sidebar, drafts)
- React Hook Form + Zod pra forms
- shadcn/ui como base. Customizar via className. Nunca fork.
- Framer Motion pra animacoes (micro-interactions, page transitions, celebrations)
- Skeleton loading pra todas as queries
- Toast pra feedback de mutations (sonner)
- Empty states com ilustracao + CTA

## Styling

- Tailwind CSS 4. Sem CSS files. Sem inline styles.
- Dark-first: todas as cores via HSL CSS variables
- `cn()` helper pra conditional classes (clsx + tailwind-merge)
- Responsive: mobile-first. Breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)

## File Naming

- Componentes: PascalCase (`PostCard.tsx`)
- Hooks: camelCase com prefixo use (`usePosts.ts`)
- Utils/libs: camelCase (`formatDate.ts`)
- Types: camelCase (`database.types.ts`)
- Pages: kebab-case via folder (`community/page.tsx`)

## Database

- SQL parametrizado via Supabase client. NUNCA string concatenation.
- org_id do contexto auth (RLS). NUNCA do request body.
- Denormalized counters via DB triggers (likes_count, comments_count)
- Cursor-based pagination (never OFFSET)
- Indexes pra toda query frequente
- Migration DOWN nao obrigatorio (Supabase migrations sao forward-only em producao)

## Git

- Conventional commits PT-BR
- Prefixos: feat, fix, test, docs, refactor, chore, style, perf
- Scopes: db, api, web, auth, gamification, payments, events, notifications
- Exemplos:
  - `feat(db): cria tabela posts com RLS`
  - `feat(web): implementa feed com infinite scroll`
  - `fix(auth): corrige refresh token no middleware`
  - `test(api): testes de integracao pra webhook Stripe`

## Testes

- Vitest pra unit tests de hooks, utils, server actions
- Playwright pra E2E (critical flows)
- Supabase local (docker-compose) pra integration tests com DB real
- Coverage target: >80% em codigo novo
- Testar RLS: user A nao ve dados de org B
