-- =============================================================
-- B001: Storage buckets — avatars, banners, covers
-- =============================================================

-- Avatars: profile pictures (5MB max)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Banners: org banners + course covers (10MB max)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'banners',
    'banners',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Covers: course thumbnails, event covers, post media (10MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'covers',
    'covers',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- RLS on storage.objects
-- Path convention:
--   avatars/{user_id}/{filename}
--   banners/{org_id}/{filename}
--   covers/{org_id}/{filename}
-- =============================================================

-- Anyone can read public buckets (already public=true above, but ensure SELECT)
DROP POLICY IF EXISTS "Public buckets readable by all" ON storage.objects;
CREATE POLICY "Public buckets readable by all"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('avatars', 'banners', 'covers'));

-- Avatars: user can write own folder only (avatars/{user_id}/...)
DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (string_to_array(name, '/'))[1]
    );

-- Banners + covers: only owners/admins of org can write (org_id = first path segment)
DROP POLICY IF EXISTS "Org admins upload banners" ON storage.objects;
CREATE POLICY "Org admins upload banners"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('banners', 'covers')
        AND public.has_org_role(
            ((string_to_array(name, '/'))[1])::uuid,
            ARRAY['owner', 'admin']
        )
    );

DROP POLICY IF EXISTS "Org admins update banners" ON storage.objects;
CREATE POLICY "Org admins update banners"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('banners', 'covers')
        AND public.has_org_role(
            ((string_to_array(name, '/'))[1])::uuid,
            ARRAY['owner', 'admin']
        )
    );

DROP POLICY IF EXISTS "Org admins delete banners" ON storage.objects;
CREATE POLICY "Org admins delete banners"
    ON storage.objects FOR DELETE
    USING (
        bucket_id IN ('banners', 'covers')
        AND public.has_org_role(
            ((string_to_array(name, '/'))[1])::uuid,
            ARRAY['owner', 'admin']
        )
    );
