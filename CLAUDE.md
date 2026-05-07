# PortalHub — CLAUDE.md

## Produto

PortalHub = plataforma all-in-one de comunidades + cursos online. Clone Skool.com com UX world-class, gamificacao nativa. Criadores criam comunidades, publicam cursos, cobram assinaturas, engajam membros via pontos/niveis/leaderboard.

## Stack

Next.js 15 (App Router, RSC, Server Actions) / TypeScript strict / Tailwind 4 / shadcn/ui / Framer Motion | Supabase (PostgreSQL 15+, Auth, Realtime, Storage, Edge Functions) | Stripe (Checkout, Billing Portal, Webhooks) | Resend (email) | Vercel (deploy)

## Estrutura

```
src/app/          → Next.js App Router (pages, layouts, API routes)
src/components/   → UI components (community, courses, gamification, events, layout, notifications, shared)
src/lib/          → Supabase clients, Stripe helpers, utils
src/hooks/        → TanStack Query hooks por dominio
src/actions/      → Server Actions (mutations)
src/types/        → TypeScript types (database.types.ts gerado, domain.ts)
supabase/         → Migrations, Edge Functions, seed
tests/            → unit, integration, e2e
PortalHub-dir/    → Vault Obsidian (source of truth)
.specs/           → Specs operacionais
```

## Protocolo de agentes

### Time

| Agente | Skill | Funcao |
|--------|-------|--------|
| **Engenheiro** | `ph-engenheiro` | Orquestra construcao, decompoe tarefas, valida arquitetura, mantem roadmap |
| **Dev Senior** | `ph-dev-senior` | Decisoes tecnicas, code review, seguranca, performance, poder de veto |
| **Dev Pleno** | `ph-dev-pleno` | Executa codigo: Next.js, React, SQL, testes, migrations |

### Fluxo obrigatorio

```
Tarefa do usuario
    |
    v
ph-engenheiro (SEMPRE primeiro)
    |
    +--> Analisa impacto, le contexto, decompoe
    |
    +--> Decisao complexa? --> ph-dev-senior (parecer)
    |
    +--> Execucao de codigo --> ph-dev-pleno (com brief denso)
    |
    +--> Review pos-execucao --> ph-dev-senior (se toca auth/security/DB)
    |
    v
Documentacao atualizada (STATE.md, vault)
```

**REGRA:** Toda tarefa passa pelo Engenheiro primeiro. Dev Pleno so executa com brief. Dev Senior so e invocado pra decisoes e reviews.

### Invocacao

```
# Engenheiro orquestra
Skill tool → ph-engenheiro

# Engenheiro invoca Dev Pleno com brief
Skill tool → ph-dev-pleno

# Engenheiro invoca Dev Senior pra decisao/review
Skill tool → ph-dev-senior
```

### Quando invocar Dev Senior

- Nova tabela no banco (review de schema + RLS)
- Feature que toca auth ou permissoes
- Integracao com servico externo (Stripe, Resend)
- Decisao entre duas abordagens tecnicas
- Code review antes de shipar feature completa
- Qualquer coisa que afete seguranca ou multi-tenancy

## Protocolo de git

### Topologia

Linear cumulativa (identico ecossistema milennials). Sem fan-out.

```
main (protegida)
  ^
develop (trunk)
  ^
fase/F0X (born from develop)
```

### Ordem de commits por sprint

1. `feat(db):` — migrations, schema, RLS
2. `feat(api):` — server actions, API routes
3. `test(api):` — unit + integration tests
4. `feat(web):` — components, hooks, pages
5. `test(web):` — vitest + playwright
6. `docs(vault):` — STATE.md, vault, backlog

### Convencoes de commit

Conventional commits em PT-BR:
- `feat(db): cria tabela posts com RLS`
- `feat(web): implementa feed com infinite scroll`
- `fix(auth): corrige refresh token no middleware`
- `test(api): testes de integracao pra webhook Stripe`
- `docs(vault): atualiza STATE.md com D010`

## Documentacao

### Vault Obsidian

`PortalHub-dir/` — fonte de verdade do produto. Qualquer feature entregue deve ter doc atualizada.

### .specs/

`.specs/` — specs operacionais. STATE.md rastreia decisoes. CONVENTIONS.md define como escrever codigo.

### Apos cada sprint entregue

- [ ] `PortalHub-dir/00 - Indice.md` atualizado com status
- [ ] `.specs/project/STATE.md` atualizado com decisoes (D00X)
- [ ] `PortalHub-dir/08 - Backlog/Master Plan.md` marca sprint como entregue
- [ ] `PortalHub-dir/06 - Features/` criterios de aceitacao verificados

## Convencoes

Ver `.specs/codebase/CONVENTIONS.md` pra regras completas.

Resumo critico:
- TypeScript strict. Sem `any`.
- Server Components por default. Client Components so quando necessario.
- Server Actions pra mutations. API Routes so pra webhooks.
- TanStack Query pra server state. Zustand pra client state.
- React Hook Form + Zod pra forms.
- Tailwind classes. Sem CSS files. Dark-first HSL vars.
- RLS OBRIGATORIO em toda tabela. ENABLE + FORCE + policy.
- org_id do contexto auth (RLS). NUNCA do request.
- Testes obrigatorios. Vitest + Playwright. Coverage >80%.

## Fases

| Sprint | Semanas | Status |
|--------|---------|--------|
| 0: Foundation | 1-2 | Nao iniciado |
| 1: Auth + Profiles + Orgs | 3-4 | Nao iniciado |
| 2: Community Feed | 5-6 | Nao iniciado |
| 3: Courses | 7-8 | Nao iniciado |
| 4: Gamificacao | 9-10 | Nao iniciado |
| 5: Payments | 11-12 | Nao iniciado |
| 6: Events + Notifications + Moderation | 13-14 | Nao iniciado |
| 7: Polish + QA + Launch | 15-16 | Nao iniciado |

## Arquivos criticos

| Arquivo | Proposito |
|---------|-----------|
| `.specs/project/STATE.md` | Decisoes e blockers |
| `.specs/codebase/CONVENTIONS.md` | Como escrever codigo |
| `.specs/codebase/ARCHITECTURE.md` | Arquitetura do sistema |
| `.specs/codebase/STRUCTURE.md` | Onde cada arquivo vive |
| `.specs/codebase/STACK.md` | Tecnologias e versoes |
| `PortalHub-dir/00 - Indice.md` | Status do vault |
| `PortalHub-dir/07 - Decisoes/` | ADRs |
| `PortalHub-dir/08 - Backlog/Master Plan.md` | Timeline e sprints |
