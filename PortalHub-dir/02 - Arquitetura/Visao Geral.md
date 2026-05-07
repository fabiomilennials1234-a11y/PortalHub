---
tags:
  - arquitetura
  - visao-geral
created: 2026-05-07
status: vivo
---

# Arquitetura — Visao Geral

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Linguagem | TypeScript 5.5+ strict |
| UI | Tailwind CSS 4 + shadcn/ui + Radix UI + Framer Motion |
| Backend | Supabase (PostgreSQL 15+, Auth, Realtime, Storage, Edge Functions) |
| Pagamentos | Stripe (Checkout, Billing Portal, Webhooks) |
| Video | Embed externo (YouTube, Vimeo, Loom) |
| Email | Resend |
| Deploy | Vercel + Supabase Cloud |
| State | TanStack Query v5 (server) + Zustand (client) |
| Forms | React Hook Form + Zod |
| Testes | Vitest + Playwright |

## Decisoes de Alto Nivel

- **Next.js vs React SPA**: Next.js pra SSR (SEO em paginas publicas), RSC (menos JS no client), Server Actions (mutations simplificadas), middleware (auth guard).
- **Supabase vs Go backend**: Supabase economiza 9-14 semanas de fundação (auth, realtime, storage, RLS). PortalHub é CRUD-heavy. Server Actions + API Routes cobrem 95%.
- **Stripe vs Asaas**: Stripe é internacional, preferencia do CTO. Asaas reservado pra variante brasileira em v2.
- **Embed vs hosted video**: Zero custo infra no MVP. Skool faz igual. Mux/Cloudflare em v2.

## Diagrama

```
[Browser]
    |
    v
[Vercel / Next.js 15]
    |-- App Router (RSC + Client Components)
    |-- Server Actions (mutations)
    |-- API Routes (webhooks)
    |-- Middleware (auth, org resolution)
    |
    +---> [Supabase Cloud]
    |       |-- PostgreSQL 15 + RLS
    |       |-- Auth (magic link, OAuth)
    |       |-- Realtime (postgres_changes)
    |       |-- Storage (avatars, attachments)
    |       |-- Edge Functions (background jobs)
    |
    +---> [Stripe] (Checkout, Portal, Webhooks)
    +---> [Resend] (email transacional)
```

## Multi-tenancy

Cada community = 1 organization. Toda tabela de domínio tem `org_id`. RLS enabled + forced em todas. Membership check via `auth.uid()` + memberships table.

## Referencia ADR

- [[07 - Decisoes/ADR-001-stack-nextjs-supabase|ADR-001: Stack Next.js + Supabase]]
