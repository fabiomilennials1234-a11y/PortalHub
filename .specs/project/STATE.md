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
- **2026-05-07**: Sprint 2 entregue. Community Feed completo. 4 tabelas (categories, posts, comments, reactions) com RLS (15 policies). Counter triggers denormalizados (likes_count, comments_count). Tiptap rich text editor (JSON/JSONB). Cursor-based infinite scroll (usePosts useInfiniteQuery). Comments 2 niveis (CommentThread recursivo). Reactions toggle (like/love/insightful/fire). CategoryFilter. PostForm dialog com Tiptap. PostCard com preview. Post detail page com ReactionBar + CommentThread. 6 hooks, 8 componentes, 2 pages. 30 tests passing. Build 0 erros, lint 0 warnings.
- **2026-05-07**: Sprint 3 entregue. Courses completo. 5 tabelas (courses, modules, lessons, enrollments, lesson_completions) com RLS (22 policies). 4 triggers (updated_at, lesson_count+duration, enrollment auto-completion). Video embed (YouTube/Vimeo/Loom) com URL validation + embed extraction. Tiptap text lessons. Enrollment + progress tracking end-to-end. 15 server actions. 6 hooks (useCourses, useCourse, useModules, useLesson, useEnrollment, useLessonProgress). 9 componentes (CourseCard, CourseForm, ModuleAccordion, LessonItem, LessonContent, VideoEmbed, EnrollButton, ProgressBar, CourseSidebar). 4 pages (list, detail, lesson player, new course). 64 tests passing. Build 0 erros, lint 0 warnings.
- **2026-05-07**: Sprint 4 entregue. Gamification completo. 4 tabelas (point_events, levels, achievements, user_achievements) com RLS (7 policies — point_events e user_achievements somente SELECT, escrita via SECURITY DEFINER functions). 6 DB triggers auto-award: post_created (10pts), comment_created (5pts), reaction_given (2pts, anti-abuse 1/24h por target + cap 100/dia), lesson_completed (20pts). award_points central function le points_config das settings da org (gamification_enabled toggle honored). calculate_level recalcula nivel pos award. Seed default levels (6 niveis: Novato→Lenda) em org criada + backfill. 5 server actions (CRUD achievements, update levels). 4 hooks (useLeaderboard, useAchievements, useActivityLog, useUserStats). 8 componentes (PointsDisplay, LevelBadge, XPBar, AchievementBadge, AchievementCard, LeaderboardTable, ActivityFeed, StatsCard). Leaderboard page com tabs ranking+atividade. Profile page enhanced (stats+achievements+activity tabs). 88 tests passing. Build 0 erros, lint 0 warnings.
- **2026-05-07**: Sprint 5 entregue. Payments completo. 3 tabelas (plans, subscriptions, payments) com RLS (8 policies — escrita restrita a admin actions e webhook SECURITY DEFINER). Stripe SDK v22 integration (Checkout Sessions + Billing Portal + Webhook). Webhook handler /api/stripe/webhook processa: checkout.session.completed, customer.subscription.created/updated/deleted, invoice.payment_succeeded/failed. Idempotente via UNIQUE(stripe_invoice_id). Stripe product+price criados automaticamente em createPlan. 6 server actions (createPlan, updatePlan, archivePlan, createCheckoutSession, createBillingPortalSession). 3 hooks (usePlans, useSubscription, usePayments). 4 componentes (PlanCard, PlansList, SubscriptionStatus, PaymentHistory). 2 pages: pricing (com checkout redirect) + settings/billing (com portal). 113 tests passing. Build 0 erros, lint 0 warnings.
- **2026-05-07**: Sprint 6 entregue. Events + Notifications + Moderation. 4 tabelas (events, event_registrations, notifications, reports) com RLS (16 policies). Realtime publication em notifications (Supabase channels). 5 DB triggers: attendees_count denormalizado, notify on comment/reaction/level_up. create_notification helper SECURITY DEFINER (skip self-notify). Events: lifecycle status (upcoming/live/ended/cancelled), max_attendees enforcement, RSVP, host_id (admin/moderator only). Reports: 6 reasons (spam/harassment/hate_speech/inappropriate/misinformation/other), 4 statuses, target_type post/comment/user. 11 server actions. 4 hooks (useEvents, useEvent, useNotifications com Realtime subscribe, useReports). 6 componentes (EventCard, EventForm, EventRSVPButton, NotificationBell com badge unread + Realtime, ReportButton dialog, ReportsList com filter+resolve). 4 pages (events list com tabs upcoming/past, event detail, new event, settings/moderation). NotificationBell integrado no Header. 149 tests passing. Build 0 erros, lint 0 warnings.
