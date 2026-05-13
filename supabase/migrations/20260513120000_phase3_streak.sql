-- =============================================================
-- Fase 3 — Streak diario (dias consecutivos com point_event)
-- =============================================================
-- Calcula sequencia atual de dias com pelo menos 1 point_event
-- num escopo (user_id, org_id). Single-pass via CTE com generate_series
-- pra evitar 365 round-trips. Timezone parametrizada (default UTC).
-- =============================================================

CREATE OR REPLACE FUNCTION public.calculate_user_streak(
    target_user_id UUID,
    target_org_id UUID,
    target_timezone TEXT DEFAULT 'UTC'
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_today DATE;
    v_streak INTEGER := 0;
BEGIN
    -- Membership gate explicit (SECURITY DEFINER bypass RLS, validamos aqui).
    IF NOT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = target_user_id
          AND org_id = target_org_id
          AND status = 'active'
    ) THEN
        RETURN 0;
    END IF;

    v_today := (now() AT TIME ZONE target_timezone)::date;

    WITH days AS (
        SELECT generate_series(v_today - INTERVAL '364 days', v_today, INTERVAL '1 day')::date AS d
    ),
    flagged AS (
        SELECT
            d.d,
            EXISTS (
                SELECT 1 FROM public.point_events pe
                WHERE pe.user_id = target_user_id
                  AND pe.org_id = target_org_id
                  AND (pe.created_at AT TIME ZONE target_timezone)::date = d.d
            ) AS had_event
        FROM days d
    ),
    walk AS (
        SELECT d, had_event,
               ROW_NUMBER() OVER (ORDER BY d DESC) AS rn
        FROM flagged
    )
    SELECT COUNT(*)::INTEGER INTO v_streak
    FROM walk
    WHERE rn <= COALESCE(
        (SELECT MIN(rn) FROM walk WHERE NOT had_event AND rn > 1) - 1,
        365
    )
      AND (had_event OR rn = 1);

    -- Hoje sem evento ainda nao quebra streak: descontamos rn=1 se vazio.
    IF NOT EXISTS (
        SELECT 1 FROM public.point_events pe
        WHERE pe.user_id = target_user_id
          AND pe.org_id = target_org_id
          AND (pe.created_at AT TIME ZONE target_timezone)::date = v_today
    ) THEN
        -- Recalcula a partir de ontem
        WITH days AS (
            SELECT generate_series(v_today - INTERVAL '364 days', v_today - INTERVAL '1 day', INTERVAL '1 day')::date AS d
        ),
        flagged AS (
            SELECT
                d.d,
                EXISTS (
                    SELECT 1 FROM public.point_events pe
                    WHERE pe.user_id = target_user_id
                      AND pe.org_id = target_org_id
                      AND (pe.created_at AT TIME ZONE target_timezone)::date = d.d
                ) AS had_event
            FROM days d
        ),
        walk AS (
            SELECT d, had_event,
                   ROW_NUMBER() OVER (ORDER BY d DESC) AS rn
            FROM flagged
        )
        SELECT COUNT(*)::INTEGER INTO v_streak
        FROM walk
        WHERE rn < COALESCE(
            (SELECT MIN(rn) FROM walk WHERE NOT had_event),
            365
        );
    END IF;

    RETURN v_streak;
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_user_streak(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_user_streak(UUID, UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.calculate_user_streak IS
    'Retorna dias consecutivos com pelo menos 1 point_event no escopo (user, org, timezone). Hoje sem evento nao quebra streak ainda. SECURITY DEFINER valida membership ativa. Index idx_point_events_user_org_created (gamification migration) cobre a busca.';

-- NOTA: index idx_point_events_user_org_created ja criado em 20260507180000_gamification.sql
-- (user_id, org_id, created_at DESC) — nao recriar.
