---
tags:
  - adr
  - decisao
created: 2026-05-07
status: aceita
---

# ADR-001: Stack Next.js + Supabase

## Contexto

PortalHub precisa de uma stack pra MVP de plataforma de comunidades + cursos. Ecossistema milennials usa Go+React (TypeCall, Torque-v2) ou Supabase+React (v8). CTO prefere Next.js + Stripe.

## Opcoes

### A: Go backend + React SPA (pattern TypeCall)
- **Pro**: consistência com ecossistema, performance Go, controle total
- **Con**: 9-14 semanas de fundação (auth, realtime, storage, RLS custom) antes da primeira feature

### B: Next.js + Supabase (escolhida)
- **Pro**: auth+realtime+storage+DB+RLS out of box. SSR pra SEO. Server Actions simplificam mutations. MVP em 16 semanas vs 28+.
- **Con**: vendor lock-in Supabase (mitigável: Postgres standard + self-hosted path)

### C: Next.js + Node.js custom API
- **Pro**: user preference (Node.js)
- **Con**: reimplementa auth, realtime, storage, RLS. Esforço similar a Go. Sem benefício de performance do Go.

## Decisao

**Opcao B: Next.js 15 + Supabase.** PortalHub é CRUD-heavy. Supabase cobre 95% das necessidades. Server Actions + API Routes cobrem os 5% restantes (Stripe webhooks, aggregation).

## Consequencias

- Deploy em Vercel (Next.js nativo) + Supabase Cloud
- Skills (ph-dev-pleno) referenciam patterns Next.js/Supabase, não Go
- Migração futura pra Go backend possível se escala exigir (Supabase → self-hosted Postgres + Go services)
- Convenções seguem patterns do v8milennialsb2bv2 (Supabase-based)
