-- =============================================================
-- Fase 3 — Creditos ganhos esta semana por user/org
-- =============================================================
-- View: agrega point_events nos ultimos 7 dias (rolling window).
-- security_invoker honra RLS de point_events.
-- =============================================================

CREATE OR REPLACE VIEW public.user_weekly_delta
WITH (security_invoker = true)
AS
SELECT
    pe.user_id,
    pe.org_id,
    SUM(pe.points)::INTEGER AS weekly_points,
    COUNT(*)::INTEGER AS weekly_events,
    MAX(pe.created_at) AS last_event_at
FROM public.point_events pe
WHERE pe.created_at >= (now() - INTERVAL '7 days')
GROUP BY pe.user_id, pe.org_id;

COMMENT ON VIEW public.user_weekly_delta IS
    'Soma creditos ganhos nos ultimos 7 dias (rolling) por (user, org). security_invoker honra RLS de point_events.';

GRANT SELECT ON public.user_weekly_delta TO authenticated;

-- =============================================================
-- Ranking semanal (top da semana) — tiebreaker triplo pra estabilidade
-- =============================================================
CREATE OR REPLACE VIEW public.user_weekly_ranking
WITH (security_invoker = true)
AS
SELECT
    org_id,
    user_id,
    weekly_points,
    weekly_events,
    ROW_NUMBER() OVER (
        PARTITION BY org_id
        ORDER BY weekly_points DESC, last_event_at DESC, user_id
    ) AS rank
FROM public.user_weekly_delta;

COMMENT ON VIEW public.user_weekly_ranking IS
    'Rank semanal por org. Tiebreaker: weekly_points DESC -> last_event_at DESC -> user_id (estavel entre paginacoes). RLS herda do user_weekly_delta.';

GRANT SELECT ON public.user_weekly_ranking TO authenticated;
