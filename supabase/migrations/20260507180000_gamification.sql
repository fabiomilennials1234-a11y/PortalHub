-- =============================================================
-- Sprint 4: Gamification — points, levels, achievements
-- =============================================================

-- =============================================================
-- 1. POINT_EVENTS
-- =============================================================
CREATE TABLE public.point_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 2. LEVELS
-- =============================================================
CREATE TABLE public.levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    level_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL,
    icon TEXT,
    color TEXT,
    perks JSONB NOT NULL DEFAULT '{}',
    UNIQUE(org_id, level_number)
);

-- =============================================================
-- 3. ACHIEVEMENTS
-- =============================================================
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('milestone', 'streak', 'special')),
    criteria JSONB NOT NULL,
    badge_url TEXT,
    icon TEXT,
    color TEXT,
    points_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. USER_ACHIEVEMENTS
-- =============================================================
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- =============================================================
-- 5. INDEXES
-- =============================================================
CREATE INDEX idx_point_events_user_org_created ON public.point_events(user_id, org_id, created_at DESC);
CREATE INDEX idx_point_events_org_created ON public.point_events(org_id, created_at DESC);
CREATE INDEX idx_point_events_user_action ON public.point_events(user_id, action);
CREATE INDEX idx_point_events_reference ON public.point_events(reference_type, reference_id);

CREATE INDEX idx_levels_org_min_points ON public.levels(org_id, min_points);

CREATE INDEX idx_achievements_org ON public.achievements(org_id);

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON public.user_achievements(achievement_id);

-- =============================================================
-- 6. POINT VALUES — defaults (per OrgSettings.points_config)
-- =============================================================
-- Helper function to get points config for an org with safe defaults.
CREATE OR REPLACE FUNCTION public.get_action_points(p_org_id UUID, p_action TEXT)
RETURNS INTEGER AS $$
DECLARE
    v_settings JSONB;
    v_points INTEGER;
    v_default INTEGER;
BEGIN
    SELECT settings INTO v_settings FROM public.organizations WHERE id = p_org_id;

    -- Default values mirror OrgSettings.points_config defaults
    v_default := CASE p_action
        WHEN 'post_created' THEN 10
        WHEN 'comment_created' THEN 5
        WHEN 'lesson_completed' THEN 20
        WHEN 'reaction_given' THEN 2
        WHEN 'daily_login' THEN 15
        ELSE 0
    END;

    v_points := COALESCE(
        (v_settings->'points_config'->>p_action)::INTEGER,
        v_default
    );

    -- Honor gamification_enabled toggle
    IF COALESCE((v_settings->>'gamification_enabled')::BOOLEAN, true) = false THEN
        RETURN 0;
    END IF;

    RETURN v_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================
-- 7. LEVEL CALCULATION
-- =============================================================
CREATE OR REPLACE FUNCTION public.calculate_level(p_org_id UUID, p_points INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_level INTEGER;
BEGIN
    SELECT COALESCE(MAX(level_number), 1) INTO v_level
    FROM public.levels
    WHERE org_id = p_org_id
    AND min_points <= p_points;

    RETURN v_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================================
-- 8. AWARD POINTS — central function used by all action triggers
-- =============================================================
CREATE OR REPLACE FUNCTION public.award_points(
    p_user_id UUID,
    p_org_id UUID,
    p_action TEXT,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_points INTEGER;
    v_new_total INTEGER;
    v_new_level INTEGER;
BEGIN
    v_points := public.get_action_points(p_org_id, p_action);
    IF v_points <= 0 THEN
        RETURN;
    END IF;

    -- Anti-abuse for reactions: max 1 per target per day
    IF p_action = 'reaction_given' AND p_reference_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.point_events
            WHERE user_id = p_user_id
            AND action = 'reaction_given'
            AND reference_id = p_reference_id
            AND created_at > now() - INTERVAL '24 hours'
        ) THEN
            RETURN;
        END IF;

        -- Daily cap: max 100 reaction points/day
        IF (
            SELECT COALESCE(SUM(points), 0) FROM public.point_events
            WHERE user_id = p_user_id
            AND org_id = p_org_id
            AND action = 'reaction_given'
            AND created_at::date = now()::date
        ) >= 100 THEN
            RETURN;
        END IF;
    END IF;

    -- Insert point event
    INSERT INTO public.point_events (user_id, org_id, action, points, reference_type, reference_id)
    VALUES (p_user_id, p_org_id, p_action, v_points, p_reference_type, p_reference_id);

    -- Update membership points + level
    UPDATE public.memberships
    SET points = points + v_points
    WHERE user_id = p_user_id AND org_id = p_org_id
    RETURNING points INTO v_new_total;

    IF v_new_total IS NOT NULL THEN
        v_new_level := public.calculate_level(p_org_id, v_new_total);
        UPDATE public.memberships
        SET level = v_new_level
        WHERE user_id = p_user_id AND org_id = p_org_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- 9. TRIGGER: award points on post_created
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_post_points()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.award_points(
        NEW.author_id,
        NEW.org_id,
        'post_created',
        'post',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_created_award_points
    AFTER INSERT ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_post_points();

-- =============================================================
-- 10. TRIGGER: award points on comment_created
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_comment_points()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT org_id INTO v_org_id FROM public.posts WHERE id = NEW.post_id;
    IF v_org_id IS NULL THEN RETURN NEW; END IF;

    PERFORM public.award_points(
        NEW.author_id,
        v_org_id,
        'comment_created',
        'comment',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created_award_points
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_comment_points();

-- =============================================================
-- 11. TRIGGER: award points on reaction_given
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_reaction_points()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
BEGIN
    -- Resolve org_id from target
    IF NEW.target_type = 'post' THEN
        SELECT org_id INTO v_org_id FROM public.posts WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'comment' THEN
        SELECT p.org_id INTO v_org_id
        FROM public.comments c
        JOIN public.posts p ON p.id = c.post_id
        WHERE c.id = NEW.target_id;
    END IF;

    IF v_org_id IS NULL THEN RETURN NEW; END IF;

    PERFORM public.award_points(
        NEW.user_id,
        v_org_id,
        'reaction_given',
        NEW.target_type,
        NEW.target_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_created_award_points
    AFTER INSERT ON public.reactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_reaction_points();

-- =============================================================
-- 12. TRIGGER: award points on lesson_completed
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_lesson_completion_points()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT c.org_id INTO v_org_id
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    JOIN public.courses c ON c.id = m.course_id
    WHERE l.id = NEW.lesson_id;

    IF v_org_id IS NULL THEN RETURN NEW; END IF;

    PERFORM public.award_points(
        NEW.user_id,
        v_org_id,
        'lesson_completed',
        'lesson',
        NEW.lesson_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_completed_award_points
    AFTER INSERT ON public.lesson_completions
    FOR EACH ROW EXECUTE FUNCTION public.handle_lesson_completion_points();

-- =============================================================
-- 13. SEED DEFAULT LEVELS for new orgs
-- =============================================================
CREATE OR REPLACE FUNCTION public.seed_default_levels()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.levels (org_id, level_number, name, min_points, color) VALUES
        (NEW.id, 1, 'Novato', 0, '#94a3b8'),
        (NEW.id, 2, 'Participante', 50, '#60a5fa'),
        (NEW.id, 3, 'Contribuidor', 150, '#34d399'),
        (NEW.id, 4, 'Engajado', 400, '#fbbf24'),
        (NEW.id, 5, 'Expert', 1000, '#fb7185'),
        (NEW.id, 6, 'Lenda', 2500, '#a78bfa');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_org_created_seed_levels
    AFTER INSERT ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.seed_default_levels();

-- Seed levels for existing orgs (backfill)
INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 1, 'Novato', 0, '#94a3b8' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 2, 'Participante', 50, '#60a5fa' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 3, 'Contribuidor', 150, '#34d399' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 4, 'Engajado', 400, '#fbbf24' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 5, 'Expert', 1000, '#fb7185' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

INSERT INTO public.levels (org_id, level_number, name, min_points, color)
SELECT o.id, 6, 'Lenda', 2500, '#a78bfa' FROM public.organizations o
ON CONFLICT (org_id, level_number) DO NOTHING;

-- =============================================================
-- 14. RLS: POINT_EVENTS
-- =============================================================
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_events FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org point events"
    ON public.point_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = point_events.org_id
            AND memberships.status = 'active'
        )
    );

-- No INSERT/UPDATE/DELETE policies — only SECURITY DEFINER functions write here.

-- =============================================================
-- 15. RLS: LEVELS
-- =============================================================
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org levels"
    ON public.levels FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = levels.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can manage levels"
    ON public.levels FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = levels.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 16. RLS: ACHIEVEMENTS
-- =============================================================
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org achievements"
    ON public.achievements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = achievements.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can manage achievements"
    ON public.achievements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = achievements.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 17. RLS: USER_ACHIEVEMENTS
-- =============================================================
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org user achievements"
    ON public.user_achievements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.achievements a
            JOIN public.memberships m ON m.org_id = a.org_id
            WHERE a.id = user_achievements.achievement_id
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

-- No INSERT/UPDATE/DELETE — only SECURITY DEFINER functions write here.
