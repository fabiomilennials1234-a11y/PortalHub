-- =============================================================
-- Sprint 3: Courses, Modules, Lessons, Enrollments, Progress
-- =============================================================

-- =============================================================
-- 1. COURSES
-- =============================================================
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    access_type TEXT NOT NULL DEFAULT 'free' CHECK (access_type IN ('free', 'paid', 'level_locked')),
    required_level INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, slug)
);

-- =============================================================
-- 2. MODULES
-- =============================================================
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 3. LESSONS
-- =============================================================
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'embed')),
    video_url TEXT,
    text_content JSONB,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. ENROLLMENTS
-- =============================================================
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

-- =============================================================
-- 5. LESSON_COMPLETIONS
-- =============================================================
CREATE TABLE public.lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- =============================================================
-- 6. INDEXES
-- =============================================================
CREATE INDEX idx_courses_org_status_position ON public.courses(org_id, status, position);
CREATE INDEX idx_courses_org_slug ON public.courses(org_id, slug);
CREATE INDEX idx_courses_author ON public.courses(author_id);

CREATE INDEX idx_modules_course_position ON public.modules(course_id, position);

CREATE INDEX idx_lessons_module_position ON public.lessons(module_id, position);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_user_course ON public.enrollments(user_id, course_id);

CREATE INDEX idx_lesson_completions_user ON public.lesson_completions(user_id);
CREATE INDEX idx_lesson_completions_lesson ON public.lesson_completions(lesson_id);
CREATE INDEX idx_lesson_completions_user_lesson ON public.lesson_completions(user_id, lesson_id);

-- =============================================================
-- 7. TRIGGERS: updated_at (reuse function from Sprint 1)
-- =============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================
-- 8. TRIGGER: denormalized lesson count + duration on courses
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_course_lesson_count()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_lesson_count INTEGER;
    v_total_duration INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_course_id := (SELECT m.course_id FROM public.modules m WHERE m.id = NEW.module_id);
    ELSIF TG_OP = 'DELETE' THEN
        v_course_id := (SELECT m.course_id FROM public.modules m WHERE m.id = OLD.module_id);
    END IF;

    SELECT COUNT(*), COALESCE(SUM(l.duration_seconds), 0)
    INTO v_lesson_count, v_total_duration
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_course_id;

    UPDATE public.courses
    SET total_lessons = v_lesson_count,
        total_duration_seconds = v_total_duration
    WHERE id = v_course_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_count_change
    AFTER INSERT OR DELETE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.handle_course_lesson_count();

-- =============================================================
-- 9. TRIGGER: recalculate duration when lesson duration changes
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_lesson_duration_update()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_total_duration INTEGER;
BEGIN
    IF OLD.duration_seconds IS DISTINCT FROM NEW.duration_seconds THEN
        v_course_id := (SELECT m.course_id FROM public.modules m WHERE m.id = NEW.module_id);

        SELECT COALESCE(SUM(l.duration_seconds), 0)
        INTO v_total_duration
        FROM public.lessons l
        JOIN public.modules m ON m.id = l.module_id
        WHERE m.course_id = v_course_id;

        UPDATE public.courses
        SET total_duration_seconds = v_total_duration
        WHERE id = v_course_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_duration_update
    AFTER UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.handle_lesson_duration_update();

-- =============================================================
-- 10. TRIGGER: auto-complete enrollment when all lessons done
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_enrollment_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_total_lessons INTEGER;
    v_completed_lessons INTEGER;
BEGIN
    SELECT m.course_id INTO v_course_id
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE l.id = NEW.lesson_id;

    SELECT COUNT(*) INTO v_total_lessons
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_course_id;

    SELECT COUNT(*) INTO v_completed_lessons
    FROM public.lesson_completions lc
    JOIN public.lessons l ON l.id = lc.lesson_id
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_course_id
    AND lc.user_id = NEW.user_id;

    IF v_completed_lessons >= v_total_lessons AND v_total_lessons > 0 THEN
        UPDATE public.enrollments
        SET completed_at = now()
        WHERE user_id = NEW.user_id
        AND course_id = v_course_id
        AND completed_at IS NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_lesson_completion_check_enrollment
    AFTER INSERT ON public.lesson_completions
    FOR EACH ROW EXECUTE FUNCTION public.handle_enrollment_completion();

-- =============================================================
-- 11. RLS: COURSES
-- =============================================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view published courses"
    ON public.courses FOR SELECT
    USING (
        status = 'published'
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = courses.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can view all courses in org"
    ON public.courses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = courses.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can create courses"
    ON public.courses FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = courses.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can update courses"
    ON public.courses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = courses.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can delete courses"
    ON public.courses FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = courses.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 12. RLS: MODULES
-- =============================================================
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view modules of published courses"
    ON public.modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = modules.course_id
            AND c.status = 'published'
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can view all modules in org"
    ON public.modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = modules.course_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can create modules"
    ON public.modules FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = modules.course_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can update modules"
    ON public.modules FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = modules.course_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can delete modules"
    ON public.modules FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = modules.course_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

-- =============================================================
-- 13. RLS: LESSONS
-- =============================================================
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons FORCE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled members can view lessons"
    ON public.lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.enrollments e ON e.course_id = c.id
            WHERE mod.id = lessons.module_id
            AND c.status = 'published'
            AND e.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can view free preview lessons"
    ON public.lessons FOR SELECT
    USING (
        is_free_preview = true
        AND EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE mod.id = lessons.module_id
            AND c.status = 'published'
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can view all lessons in org"
    ON public.lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE mod.id = lessons.module_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can create lessons"
    ON public.lessons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE mod.id = lessons.module_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can update lessons"
    ON public.lessons FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE mod.id = lessons.module_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Admin can delete lessons"
    ON public.lessons FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.modules mod
            JOIN public.courses c ON c.id = mod.course_id
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE mod.id = lessons.module_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

-- =============================================================
-- 14. RLS: ENROLLMENTS
-- =============================================================
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can view org enrollments"
    ON public.enrollments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = enrollments.course_id
            AND m.user_id = auth.uid()
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Members can enroll in published courses"
    ON public.enrollments FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.courses c
            JOIN public.memberships m ON m.org_id = c.org_id
            WHERE c.id = enrollments.course_id
            AND c.status = 'published'
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

CREATE POLICY "Users can unenroll"
    ON public.enrollments FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================
-- 15. RLS: LESSON_COMPLETIONS
-- =============================================================
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson completions"
    ON public.lesson_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Enrolled users can complete lessons"
    ON public.lesson_completions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.lessons l
            JOIN public.modules mod ON mod.id = l.module_id
            JOIN public.enrollments e ON e.course_id = mod.course_id
            WHERE l.id = lesson_completions.lesson_id
            AND e.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can uncomplete own lessons"
    ON public.lesson_completions FOR DELETE
    USING (auth.uid() = user_id);
