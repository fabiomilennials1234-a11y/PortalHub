-- =============================================================
-- Sprint 6: Events + Notifications + Moderation
-- =============================================================

-- =============================================================
-- 1. EVENTS
-- =============================================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    host_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (
        status IN ('upcoming', 'live', 'ended', 'cancelled')
    ),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    location_url TEXT,
    location_label TEXT,
    max_attendees INTEGER,
    attendees_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (ends_at > starts_at)
);

-- =============================================================
-- 2. EVENT_REGISTRATIONS
-- =============================================================
CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    attended BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(event_id, user_id)
);

-- =============================================================
-- 3. NOTIFICATIONS
-- =============================================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (
        type IN ('post_reply', 'comment_reply', 'mention', 'achievement',
                 'event_reminder', 'course_update', 'event_starting',
                 'level_up', 'reaction_received')
    ),
    title TEXT NOT NULL,
    body TEXT,
    action_url TEXT,
    reference_type TEXT,
    reference_id UUID,
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. REPORTS — moderation
-- =============================================================
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL CHECK (
        reason IN ('spam', 'harassment', 'hate_speech', 'inappropriate',
                   'misinformation', 'other')
    ),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'reviewing', 'resolved', 'dismissed')
    ),
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- =============================================================
-- 5. INDEXES
-- =============================================================
CREATE INDEX idx_events_org_starts_at ON public.events(org_id, starts_at DESC);
CREATE INDEX idx_events_org_status ON public.events(org_id, status, starts_at);
CREATE INDEX idx_events_host ON public.events(host_id);

CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_reference ON public.notifications(reference_type, reference_id);

CREATE INDEX idx_reports_org_status ON public.reports(org_id, status, created_at DESC);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);

-- =============================================================
-- 6. TRIGGERS: updated_at
-- =============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================
-- 7. TRIGGER: attendees_count denormalized
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_event_attendees_count()
RETURNS TRIGGER AS $$
DECLARE
    v_event_id UUID;
    v_count INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_event_id := NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        v_event_id := OLD.event_id;
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM public.event_registrations
    WHERE event_id = v_event_id;

    UPDATE public.events
    SET attendees_count = v_count
    WHERE id = v_event_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_registration_count
    AFTER INSERT OR DELETE ON public.event_registrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_event_attendees_count();

-- =============================================================
-- 8. NOTIFICATION HELPERS
-- =============================================================
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_org_id UUID,
    p_actor_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_body TEXT DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Don't notify self
    IF p_user_id = p_actor_id THEN RETURN NULL; END IF;

    INSERT INTO public.notifications (
        user_id, org_id, actor_id, type, title, body,
        action_url, reference_type, reference_id
    ) VALUES (
        p_user_id, p_org_id, p_actor_id, p_type, p_title, p_body,
        p_action_url, p_reference_type, p_reference_id
    ) RETURNING id INTO v_id;

    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- 9. TRIGGER: notify post author on new comment
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_comment_notify()
RETURNS TRIGGER AS $$
DECLARE
    v_post_author UUID;
    v_org_id UUID;
    v_post_title TEXT;
    v_parent_author UUID;
BEGIN
    SELECT author_id, org_id, title INTO v_post_author, v_org_id, v_post_title
    FROM public.posts WHERE id = NEW.post_id;

    -- Reply to comment: notify parent comment author
    IF NEW.parent_id IS NOT NULL THEN
        SELECT author_id INTO v_parent_author
        FROM public.comments WHERE id = NEW.parent_id;

        IF v_parent_author IS NOT NULL THEN
            PERFORM public.create_notification(
                v_parent_author,
                v_org_id,
                NEW.author_id,
                'comment_reply',
                'Alguém respondeu seu comentário',
                NULL,
                NULL,
                'comment',
                NEW.id
            );
        END IF;
    ELSE
        -- Top-level comment: notify post author
        IF v_post_author IS NOT NULL THEN
            PERFORM public.create_notification(
                v_post_author,
                v_org_id,
                NEW.author_id,
                'post_reply',
                'Novo comentário no seu post',
                v_post_title,
                NULL,
                'post',
                NEW.post_id
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created_notify
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_comment_notify();

-- =============================================================
-- 10. TRIGGER: notify on reaction received
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_reaction_notify()
RETURNS TRIGGER AS $$
DECLARE
    v_target_author UUID;
    v_org_id UUID;
BEGIN
    IF NEW.target_type = 'post' THEN
        SELECT author_id, org_id INTO v_target_author, v_org_id
        FROM public.posts WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'comment' THEN
        SELECT c.author_id, p.org_id INTO v_target_author, v_org_id
        FROM public.comments c
        JOIN public.posts p ON p.id = c.post_id
        WHERE c.id = NEW.target_id;
    END IF;

    IF v_target_author IS NOT NULL THEN
        PERFORM public.create_notification(
            v_target_author,
            v_org_id,
            NEW.user_id,
            'reaction_received',
            'Alguém reagiu ao seu conteúdo',
            NULL,
            NULL,
            NEW.target_type,
            NEW.target_id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_created_notify
    AFTER INSERT ON public.reactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_reaction_notify();

-- =============================================================
-- 11. TRIGGER: notify on level up
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_level_up_notify()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.level > OLD.level THEN
        INSERT INTO public.notifications (user_id, org_id, type, title, body)
        VALUES (
            NEW.user_id,
            NEW.org_id,
            'level_up',
            'Novo nível desbloqueado!',
            'Você alcançou o nível ' || NEW.level
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_membership_level_up
    AFTER UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION public.handle_level_up_notify();

-- =============================================================
-- 12. RLS: EVENTS
-- =============================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org events"
    ON public.events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = events.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin/moderator can create events"
    ON public.events FOR INSERT
    WITH CHECK (
        auth.uid() = host_id
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = events.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin/moderator can update events"
    ON public.events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = events.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin/moderator can delete events"
    ON public.events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = events.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 13. RLS: EVENT_REGISTRATIONS
-- =============================================================
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view event registrations"
    ON public.event_registrations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.memberships m ON m.org_id = e.org_id
            WHERE e.id = event_registrations.event_id
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

CREATE POLICY "Members can register themselves"
    ON public.event_registrations FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.memberships m ON m.org_id = e.org_id
            WHERE e.id = event_registrations.event_id
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
    );

CREATE POLICY "Members can unregister themselves"
    ON public.event_registrations FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================
-- 14. RLS: NOTIFICATIONS
-- =============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own notifications as read"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- No INSERT policy — only SECURITY DEFINER functions create notifications.

-- =============================================================
-- 15. RLS: REPORTS
-- =============================================================
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports FORCE ROW LEVEL SECURITY;

CREATE POLICY "Users see own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = reporter_id);

CREATE POLICY "Mods/admins see all org reports"
    ON public.reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = reports.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Members can submit reports"
    ON public.reports FOR INSERT
    WITH CHECK (
        auth.uid() = reporter_id
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = reports.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Mods/admins can update reports"
    ON public.reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = reports.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 16. ENABLE REALTIME for notifications
-- =============================================================
-- Realtime publication: client subscribes to inserts on notifications
-- (filtered by user_id via RLS).
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
