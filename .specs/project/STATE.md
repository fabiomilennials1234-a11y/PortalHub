# PortalHub — Estado do Projeto

## Decisoes

| ID | Decisao | Data | Status |
|----|---------|------|--------|
| D001 | Stack: Next.js 15 + Supabase + Stripe + Tailwind 4 + shadcn/ui | 2026-05-07 | Aceita |
| D002 | Deploy: Docker local (Supabase self-hosted + Next.js). Vercel/cloud reservado pra produção futura. | 2026-05-07 | Revisada |
| D003 | Video: embed externo (YouTube/Vimeo/Loom) no MVP. Mux em v2. | 2026-05-07 | Aceita |
| D004 | Pagamentos: Stripe (internacional). Asaas reservado pra v2 (mercado BR). | 2026-05-07 | Aceita |
| D005 | Rich text: Tiptap. JSON storage em JSONB. Sanitizacao server-side. | 2026-05-07 | Aceita |
| D006 | Gamificacao: portar componentes do v8milennialsb2bv2 (leaderboard, badges, streaks) | 2026-05-07 | Aceita |
| D007 | Auth: Supabase Auth (magic link + Google OAuth + email/password). Sem JWT custom. | 2026-05-07 | Aceita |
| D008 | State management: TanStack Query v5 (server) + Zustand (client) | 2026-05-07 | Aceita |
| D009 | Email: Resend + React Email templates | 2026-05-07 | Aceita |

## ADRs

- [[ADR-001-stack-nextjs-supabase]] — Justificativa completa da escolha de stack

## Blockers

Nenhum blocker ativo.

## Historico

- **2026-05-07**: Projeto criado. Vault e subagents configurados.
- **2026-05-07**: Roadmap MVP completo. 8 sprints, 16 semanas, 534h estimadas.
- **2026-05-07**: Vault preenchido: Visao, Personas, Glossario, Domain Model, Design System, ADR-001, Backlog.
- **2026-05-07**: .specs preenchidos: STACK.md, ARCHITECTURE.md, CONVENTIONS.md, STRUCTURE.md, PROJECT.md.
- **2026-05-07**: Proximo passo: Sprint 0 (Foundation).
- **2026-05-07**: D002 revisada: foco em rodar MVP 100% local com Docker. Sem deploy cloud no MVP.
- **2026-05-07**: Sprint 0 entregue. Next.js 16.2.5 + React 19 + Tailwind 4 + shadcn/ui (base-nova). 15 componentes UI. Supabase clients. Providers (Theme+Query+Tooltip). Middleware. Vitest+Playwright config. CI GitHub Actions. Folder structure completa. Smoke test passing. Build 0 erros.
- **2026-05-07**: Sprint 1 entregue. Auth (email/password, magic link, Google OAuth). Profiles (auto-create trigger). Organizations (CRUD, slug). Memberships (join/leave/role). RLS 3 tabelas (9 policies). Middleware auth guard. Platform layout (Sidebar, Header, UserMenu, MobileNav). Members page. Profile page. Org settings. 13 rotas. 10 tests passing. Build 0 erros, lint 0 warnings.
