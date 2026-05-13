-- =============================================================
-- Fase 3 — Notas pessoais por licao
-- =============================================================
-- 1 nota por (user, lesson). Body texto plain. Usuario so ve/edita
-- suas proprias notas (RLS hard). Insert valida membership ativa.
-- Design: notas persistem apos ban (dados pessoais do user).
-- =============================================================

CREATE TABLE IF NOT EXISTS public.lesson_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    body TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, lesson_id),
    CONSTRAINT lesson_notes_body_length CHECK (char_length(body) <= 10000)
);

CREATE INDEX IF NOT EXISTS lesson_notes_user_idx ON public.lesson_notes (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS lesson_notes_lesson_idx ON public.lesson_notes (lesson_id);

-- =============================================================
-- RLS — usuario so acessa suas proprias notas
-- =============================================================
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_notes FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_notes_select_own" ON public.lesson_notes;
CREATE POLICY "lesson_notes_select_own"
    ON public.lesson_notes FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "lesson_notes_insert_own" ON public.lesson_notes;
CREATE POLICY "lesson_notes_insert_own"
    ON public.lesson_notes FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT auth.uid())
        AND EXISTS (
            SELECT 1
            FROM public.lessons l
            JOIN public.modules m ON m.id = l.module_id
            JOIN public.courses c ON c.id = m.course_id
            JOIN public.memberships mb ON mb.org_id = c.org_id
            WHERE l.id = lesson_id
              AND mb.user_id = (SELECT auth.uid())
              AND mb.status = 'active'
        )
    );

DROP POLICY IF EXISTS "lesson_notes_update_own" ON public.lesson_notes;
CREATE POLICY "lesson_notes_update_own"
    ON public.lesson_notes FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "lesson_notes_delete_own" ON public.lesson_notes;
CREATE POLICY "lesson_notes_delete_own"
    ON public.lesson_notes FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- =============================================================
-- Trigger updated_at (search_path locked)
-- =============================================================
CREATE OR REPLACE FUNCTION public.lesson_notes_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lesson_notes_touch_updated_at_trg ON public.lesson_notes;
CREATE TRIGGER lesson_notes_touch_updated_at_trg
    BEFORE UPDATE ON public.lesson_notes
    FOR EACH ROW EXECUTE FUNCTION public.lesson_notes_touch_updated_at();

COMMENT ON TABLE public.lesson_notes IS
    'Notas pessoais por licao. 1 nota por (user, lesson). RLS hard: usuario so acessa proprias. Insert valida membership ativa. Notas persistem pos-ban (dados pessoais).';
