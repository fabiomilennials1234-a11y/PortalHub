-- =============================================================
-- Fix: PostgREST embed needs explicit FK from {table}.user_id|author_id|host_id
-- to public.profiles(id). Without it, embed syntax like
-- `profile:user_id(full_name, avatar_url)` fails with PGRST200.
--
-- profiles.id already references auth.users(id), and other tables also
-- reference auth.users(id), but PostgREST doesn't traverse via auth schema.
-- Adding direct FK to profiles makes the relationship discoverable.
-- =============================================================

-- memberships.user_id → profiles.id
ALTER TABLE public.memberships
    DROP CONSTRAINT IF EXISTS memberships_user_id_profile_fkey;
ALTER TABLE public.memberships
    ADD CONSTRAINT memberships_user_id_profile_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- posts.author_id → profiles.id
ALTER TABLE public.posts
    DROP CONSTRAINT IF EXISTS posts_author_id_profile_fkey;
ALTER TABLE public.posts
    ADD CONSTRAINT posts_author_id_profile_fkey
    FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- comments.author_id → profiles.id
ALTER TABLE public.comments
    DROP CONSTRAINT IF EXISTS comments_author_id_profile_fkey;
ALTER TABLE public.comments
    ADD CONSTRAINT comments_author_id_profile_fkey
    FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- courses.author_id → profiles.id
ALTER TABLE public.courses
    DROP CONSTRAINT IF EXISTS courses_author_id_profile_fkey;
ALTER TABLE public.courses
    ADD CONSTRAINT courses_author_id_profile_fkey
    FOREIGN KEY (author_id) REFERENCES public.profiles(id);

-- events.host_id → profiles.id
ALTER TABLE public.events
    DROP CONSTRAINT IF EXISTS events_host_id_profile_fkey;
ALTER TABLE public.events
    ADD CONSTRAINT events_host_id_profile_fkey
    FOREIGN KEY (host_id) REFERENCES public.profiles(id);

-- point_events.user_id → profiles.id
ALTER TABLE public.point_events
    DROP CONSTRAINT IF EXISTS point_events_user_id_profile_fkey;
ALTER TABLE public.point_events
    ADD CONSTRAINT point_events_user_id_profile_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- notifications.actor_id → profiles.id (nullable; SET NULL on delete)
ALTER TABLE public.notifications
    DROP CONSTRAINT IF EXISTS notifications_actor_id_profile_fkey;
ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_actor_id_profile_fkey
    FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- reports.reporter_id → profiles.id
ALTER TABLE public.reports
    DROP CONSTRAINT IF EXISTS reports_reporter_id_profile_fkey;
ALTER TABLE public.reports
    ADD CONSTRAINT reports_reporter_id_profile_fkey
    FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
