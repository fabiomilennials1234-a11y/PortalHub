# PortalHub — Arquitetura

## Visao Geral

Next.js 15 monolith com Supabase backend. App Router pra routing e RSC. Server Actions pra mutations. API Routes pra webhooks e logica complexa. Supabase pra auth, DB, realtime, storage.

## Diagrama

```
[Browser] → [Vercel/Next.js 15]
                |
                +→ App Router (RSC + Client Components)
                +→ Server Actions (mutations autenticadas)
                +→ API Routes (webhooks Stripe, background)
                +→ Middleware (auth guard, org resolution)
                |
                +→ [Supabase Cloud]
                |    +→ PostgreSQL 15 (schema + RLS)
                |    +→ Auth (magic link, OAuth, sessions)
                |    +→ Realtime (postgres_changes)
                |    +→ Storage (avatars, attachments)
                |    +→ Edge Functions (jobs, triggers)
                |
                +→ [Stripe] (Checkout, Portal, Webhooks)
                +→ [Resend] (email transacional)
```

## Multi-tenancy

- Cada community = 1 organization
- Toda tabela de dominio tem `org_id`
- RLS ENABLE + FORCE em todas as tabelas
- Membership check: EXISTS(memberships WHERE user_id = auth.uid() AND org_id = row.org_id AND status = 'active')
- org_id NUNCA vem do request body — sempre do contexto auth

## Data Flow

### Read (Server Component)
```
RSC → createServerClient(supabase) → query com RLS → render HTML
```

### Write (Server Action)
```
Client Component → Server Action → createServerClient(supabase) → insert/update com RLS → revalidatePath
```

### Webhook (API Route)
```
Stripe → /api/webhooks/stripe → verify signature → process event → update DB
```

### Realtime
```
Supabase postgres_changes → Client subscription → state update → re-render
```

## Auth Flow

1. User acessa rota protegida
2. Middleware checa session via @supabase/ssr
3. Sem session → redirect /login
4. Com session → resolve org via URL slug
5. Checa membership (user + org)
6. Sem membership → redirect /join/[orgSlug]
7. Com membership → render pagina

## Seguranca

- RLS em TODA tabela de dominio
- Supabase Auth sessions (httpOnly cookies via @supabase/ssr)
- Stripe webhook signature verification
- Rich text sanitizado server-side (DOMPurify ou similar)
- Video embed: allowlist de dominios, iframe sandbox
- Rate limiting: Vercel Edge Middleware
- CSRF: Next.js Server Actions tem CSRF built-in
