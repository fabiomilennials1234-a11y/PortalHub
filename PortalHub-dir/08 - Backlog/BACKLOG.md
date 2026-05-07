---
tags:
  - backlog
  - pos-mvp
created: 2026-05-07
status: vivo
---

# Backlog pos-MVP

Bugs encontrados em smoke + features a adicionar pos-launch v1.0.

## 🐛 Bugs conhecidos

### Alta prioridade

- [ ] **B001** — Storage upload nao implementado
  - Avatar/banner/cover URL hoje sao input de URL externa
  - Adicionar upload via Supabase Storage com bucket `avatars`, `banners`, `covers`
  - Server action helper + componente `<ImageUpload>` reutilizavel

- [ ] **B002** — Free preview lessons sem enrollment nao renderizam
  - RLS policy "Members can view free preview lessons" requer JOIN modules+courses+memberships
  - Validar fluxo: user nao-enrolled abre lesson com is_free_preview=true → deve ver conteudo
  - Adicionar test E2E

- [ ] **B003** — Comments aninhados level > 2
  - UI bloqueia reply em level 2, mas DB nao bloqueia
  - Adicionar CHECK constraint ou validacao em createComment action

- [ ] **B004** — Email de magic link nao chega em prod
  - Local funciona via Mailpit. Prod precisa Resend ou SES configurado no Supabase Auth
  - Documentar em Launch Checklist

### Media prioridade

- [ ] **B005** — Achievements nao sao auto-awarded
  - Migration cria achievements table mas sem trigger pra detectar quando usuario bate criteria
  - Edge function ou trigger pos-INSERT em point_events que verifica thresholds

- [ ] **B006** — Daily login points nao sao awarded
  - Sem trigger automatico. Precisa hook em getUser ou edge function diaria
  - Pattern: cron job em Supabase Edge Functions (1x dia por user com last login)

- [ ] **B007** — Reorder modules/lessons sem UI
  - Server action existe (reorderLessons) mas frontend nao tem drag-and-drop
  - Adicionar @dnd-kit + UI no curso edit page

- [ ] **B008** — Search global nao existe
  - Sem busca em posts/courses/users
  - Adicionar Postgres full-text search (tsvector + GIN index)

### Baixa prioridade

- [ ] **B009** — Course thumbnail aspect ratio quebra com imagens portrait
  - Fix: forcar object-cover + aspect-video container
  - Ja aplicado em CourseCard mas verificar em outros places

- [ ] **B010** — Sitemap.xml so lista 3 paginas estaticas
  - Adicionar orgs publicas + cursos publicados

- [ ] **B011** — OG image generica (sem image)
  - Adicionar `/opengraph-image.tsx` dinamico (Next.js ImageResponse)

## ✨ Features planejadas

### v1.1 — Quality of life

- [ ] **F001** — Dark/Light theme toggle
  - Theme provider ja configurado (next-themes via Providers.tsx)
  - Adicionar toggle em Header/UserMenu

- [ ] **F002** — Notification preferences
  - Tabela `notification_preferences` (user_id, type, email, push, in_app)
  - UI em /account/notifications

- [ ] **F003** — Convites pra org via email
  - Tabela `invitations` (org_id, email, role, token, expires_at)
  - Email template via Resend
  - Pagina /invite/[token] pra aceitar

- [ ] **F004** — Mention em posts/comments com `@username`
  - Detect mentions em Tiptap, criar notifications type='mention'

- [ ] **F005** — Bookmark de posts/courses
  - Tabela `bookmarks` simples (user_id, target_type, target_id)
  - UI em PostCard, CourseCard
  - Pagina /[orgSlug]/bookmarks

### v1.2 — Engagement

- [ ] **F006** — Streaks (7/30 dias consecutivos)
  - Tabela `streaks` (user_id, org_id, current_count, longest_count, last_activity_at)
  - Update via trigger em point_events
  - Award achievement '7-Day Streak' / '30-Day Streak'

- [ ] **F007** — Quiz lessons
  - Adicionar content_type='quiz' em lessons
  - Tabela `quiz_attempts` (lesson_id, user_id, answers, score)
  - UI Quiz player + correcao

- [ ] **F008** — Live events (status='live')
  - Trigger automatico baseado em starts_at/ends_at
  - Banner global "Evento ao vivo agora" se user inscrito
  - Notification 15min antes do evento (cron)

- [ ] **F009** — Mensagens diretas (DM)
  - Tabela `conversations`, `messages`
  - Realtime via Supabase channels
  - Pagina /[orgSlug]/messages

### v1.3 — Monetizacao

- [ ] **F010** — Tiers de plano (free, pro, premium)
  - Acesso condicional a courses por tier
  - Coluna `course.required_tier`
  - UI mostra "Upgrade pra ver" em PlanCard se locked

- [ ] **F011** — Cupons / promocoes
  - Stripe Coupons API integration
  - Admin UI pra criar cupom

- [ ] **F012** — Affiliate program
  - Tabela `referrals` com commission tracking
  - Stripe Connect pra payouts

- [ ] **F013** — Dashboard de revenue (admin)
  - MRR, churn, LTV charts (Recharts)
  - Pagina /[orgSlug]/settings/revenue

### v1.4 — Mobile + Realtime

- [ ] **F014** — Mobile responsive completo
  - Audit todas pages em < 640px
  - Bottom nav em mobile

- [ ] **F015** — Push notifications
  - Web Push API + service worker
  - Pra notifications + event reminders

- [ ] **F016** — Realtime presence (online users)
  - Supabase presence em community feed
  - "X users online" badge

## 📋 Como trabalhar

Pra cada item:
1. Criar branch `fix/B00X-descricao` ou `feat/F00X-descricao` partindo de develop
2. Implementar seguindo padroes existentes (Server Action + hook + component + test)
3. Verificar: tsc, build, lint, vitest
4. Commit conventional + PR pra develop
5. Apos merge: tag patch (v1.0.1) ou minor (v1.1.0)

Stack de teste local sempre rodando:
- App: http://localhost:3000
- Studio: http://127.0.0.1:54323
- Mailpit: http://127.0.0.1:54324
