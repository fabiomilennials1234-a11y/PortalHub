-- Sprint 1: Auth + Profiles + Organizations + Memberships
-- PortalHub multi-tenant foundation

-- =============================================================
-- 1. PROFILES
-- =============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 2. ORGANIZATIONS
-- =============================================================
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    theme_color TEXT NOT NULL DEFAULT '#6366f1',
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    settings JSONB NOT NULL DEFAULT '{
        "visibility": "public",
        "join_mode": "open",
        "gamification_enabled": true,
        "points_config": {
            "post_created": 10,
            "comment_created": 5,
            "lesson_completed": 20,
            "reaction_given": 2,
            "daily_login": 15
        }
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 3. MEMBERSHIPS
-- =============================================================
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'banned', 'pending')),
    points INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, org_id)
);

-- =============================================================
-- 4. INDEXES
-- =============================================================
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX idx_memberships_user_org ON public.memberships(user_id, org_id);
CREATE INDEX idx_memberships_org ON public.memberships(org_id);
CREATE INDEX idx_memberships_user ON public.memberships(user_id);

-- =============================================================
-- 5. TRIGGERS: updated_at
-- =============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================
-- 6. TRIGGER: auto-create profile on signup
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- 7. RLS: PROFILES
-- =============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =============================================================
-- 8. RLS: ORGANIZATIONS
-- =============================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view organizations"
    ON public.organizations FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create organizations"
    ON public.organizations FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner or admin can update organization"
    ON public.organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = organizations.id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Only owner can delete organization"
    ON public.organizations FOR DELETE
    USING (auth.uid() = owner_id);

-- =============================================================
-- 9. RLS: MEMBERSHIPS
-- =============================================================
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own org memberships"
    ON public.memberships FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships AS m
            WHERE m.user_id = auth.uid()
            AND m.org_id = memberships.org_id
            AND m.status = 'active'
        )
    );

CREATE POLICY "Users can join open organizations"
    ON public.memberships FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND (
            EXISTS (
                SELECT 1 FROM public.organizations
                WHERE organizations.id = org_id
                AND (organizations.settings->>'join_mode') = 'open'
            )
            OR EXISTS (
                SELECT 1 FROM public.organizations
                WHERE organizations.id = org_id
                AND organizations.owner_id = auth.uid()
            )
        )
    );

CREATE POLICY "Owner or admin can manage memberships"
    ON public.memberships FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships AS m
            WHERE m.user_id = auth.uid()
            AND m.org_id = memberships.org_id
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );

CREATE POLICY "Users can leave or owner/admin can remove"
    ON public.memberships FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.memberships AS m
            WHERE m.user_id = auth.uid()
            AND m.org_id = memberships.org_id
            AND m.role IN ('owner', 'admin')
            AND m.status = 'active'
        )
    );
