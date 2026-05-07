-- Sprint 2: Community Feed — categories, posts, comments, reactions

-- =============================================================
-- 1. CATEGORIES
-- =============================================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6366f1',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, slug)
);

-- =============================================================
-- 2. POSTS
-- =============================================================
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body JSONB NOT NULL,
    pinned BOOLEAN NOT NULL DEFAULT false,
    locked BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 3. COMMENTS
-- =============================================================
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    body JSONB NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. REACTIONS
-- =============================================================
CREATE TABLE public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'insightful', 'fire')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, target_type, target_id)
);

-- =============================================================
-- 5. INDEXES
-- =============================================================
CREATE INDEX idx_categories_org_position ON public.categories(org_id, position);
CREATE INDEX idx_posts_org_created ON public.posts(org_id, created_at DESC);
CREATE INDEX idx_posts_org_pinned_created ON public.posts(org_id, pinned DESC, created_at DESC);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_comments_post_created ON public.comments(post_id, created_at);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_reactions_target ON public.reactions(target_type, target_id);

-- =============================================================
-- 6. TRIGGERS: updated_at (reuse function from Sprint 1)
-- =============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================
-- 7. TRIGGERS: counter denormalization
-- =============================================================

-- Reaction counter on posts
CREATE OR REPLACE FUNCTION public.handle_reaction_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.target_type = 'post' THEN
        UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
    ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'post' THEN
        UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.target_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_post_count
    AFTER INSERT OR DELETE ON public.reactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_reaction_post_count();

-- Reaction counter on comments
CREATE OR REPLACE FUNCTION public.handle_reaction_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.target_type = 'comment' THEN
        UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
    ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'comment' THEN
        UPDATE public.comments SET likes_count = likes_count - 1 WHERE id = OLD.target_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_comment_count
    AFTER INSERT OR DELETE ON public.reactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_reaction_comment_count();

-- Comment counter on posts
CREATE OR REPLACE FUNCTION public.handle_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_count
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();

-- =============================================================
-- 8. RLS: CATEGORIES
-- =============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own org categories"
    ON public.categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = categories.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can manage categories"
    ON public.categories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = categories.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can update categories"
    ON public.categories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = categories.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Admin can delete categories"
    ON public.categories FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = categories.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 9. RLS: POSTS
-- =============================================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own org published posts"
    ON public.posts FOR SELECT
    USING (
        published = true
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = posts.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Members can create posts in own org"
    ON public.posts FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = posts.org_id
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Author can update own post"
    ON public.posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Moderators can update any post in org"
    ON public.posts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = posts.org_id
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Author or admin can delete post"
    ON public.posts FOR DELETE
    USING (
        auth.uid() = author_id
        OR EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = posts.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 10. RLS: COMMENTS
-- =============================================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments FORCE ROW LEVEL SECURITY;

CREATE POLICY "Members can view comments on org posts"
    ON public.comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.posts
            JOIN public.memberships ON memberships.org_id = posts.org_id
            WHERE posts.id = comments.post_id
            AND memberships.user_id = auth.uid()
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Members can comment on unlocked posts"
    ON public.comments FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM public.posts
            JOIN public.memberships ON memberships.org_id = posts.org_id
            WHERE posts.id = comments.post_id
            AND posts.locked = false
            AND memberships.user_id = auth.uid()
            AND memberships.status = 'active'
        )
    );

CREATE POLICY "Author or moderator can delete comment"
    ON public.comments FOR DELETE
    USING (
        auth.uid() = author_id
        OR EXISTS (
            SELECT 1 FROM public.posts
            JOIN public.memberships ON memberships.org_id = posts.org_id
            WHERE posts.id = comments.post_id
            AND memberships.user_id = auth.uid()
            AND memberships.role IN ('owner', 'admin', 'moderator')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 11. RLS: REACTIONS
-- =============================================================
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions FORCE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed can view reactions"
    ON public.reactions FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert own reactions"
    ON public.reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
    ON public.reactions FOR DELETE
    USING (auth.uid() = user_id);
