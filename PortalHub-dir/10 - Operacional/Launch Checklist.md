---
tags:
  - operacional
  - launch
created: 2026-05-07
status: vivo
---

# Launch Checklist

Checklist pra colocar PortalHub em produção. Revisado a cada release.

## 1. Banco de Dados

- [ ] Todas migrations aplicadas em produção (`supabase db push`)
- [ ] RLS ENABLE + FORCE em toda tabela de domínio
- [ ] Backups automáticos habilitados (Supabase configura por padrão)
- [ ] Realtime publication ativa em `notifications`
- [ ] Indexes criados nas colunas de query principal (org_id, created_at, etc.)

## 2. Autenticação

- [ ] Provedor Google OAuth configurado no Supabase Dashboard
- [ ] Magic link template de email customizado
- [ ] URLs de redirect adicionadas em Auth → URL Configuration
- [ ] Rate limiting de signups habilitado

## 3. Stripe

- [ ] Webhook endpoint configurado: `https://<APP>/api/stripe/webhook`
- [ ] Eventos selecionados:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] `STRIPE_WEBHOOK_SECRET` em produção
- [ ] Billing Portal configurado (cancellation policies, branding)
- [ ] Test mode validado antes de live mode

## 4. Variáveis de Ambiente (Vercel/Produção)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (secret)
- [ ] `STRIPE_SECRET_KEY` (live)
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live)
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (URL final de produção)

## 5. Domínio + DNS

- [ ] Domínio apontado pra Vercel
- [ ] SSL ativo (auto via Vercel)
- [ ] `www` redirect configurado
- [ ] `NEXT_PUBLIC_APP_URL` reflete domínio final
- [ ] sitemap.xml e robots.txt servindo URLs do domínio

## 6. SEO + Performance

- [ ] Open Graph image (`/opengraph-image.png` ou via metadata)
- [ ] Lighthouse score > 90 em mobile e desktop
- [ ] Imagens otimizadas via `next/image`
- [ ] Fontes carregando via `next/font` (já configurado)
- [ ] Sitemap submetido ao Google Search Console

## 7. Monitoramento

- [ ] Sentry ou error tracker configurado
- [ ] Logs de webhook em fluxo (Stripe + Supabase)
- [ ] Uptime monitor (UptimeRobot, Better Stack)
- [ ] Alertas de erro 5xx no dashboard

## 8. Legal

- [ ] Página de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Política de cookies (se aplicável)
- [ ] Contato/email de suporte visível

## 9. Smoke test em produção

Rodar manualmente após deploy:

- [ ] Landing carrega sem erros
- [ ] Signup com email cria conta
- [ ] Login com email funciona
- [ ] Login Google OAuth funciona
- [ ] Criar org → criar post → reagir → comentar
- [ ] Criar curso → criar lição vídeo (YouTube embed) → enroll → completar
- [ ] Criar evento → RSVP funciona
- [ ] Criar plan → checkout em test mode → webhook atualiza subscription
- [ ] Notification bell mostra notificação em real-time após ação de outro user
- [ ] Reportar conteúdo → moderador vê em queue → resolve

## 10. Rollback plan

- [ ] Vercel deploy rollback (Vercel → Deployments → Promote)
- [ ] Migration rollback documentado (down migrations)
- [ ] Backup do DB antes de migration crítica
