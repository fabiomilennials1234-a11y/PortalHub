-- =============================================================
-- Fix: infinite recursion in memberships SELECT policy
-- =============================================================
-- Original "Members can view own org memberships" policy referenced
-- memberships inside its own USING clause, causing Postgres to detect
-- recursion (42P17). Replace with SECURITY DEFINER helper function +
-- non-recursive policies.

-- Helper that bypasses RLS (SECURITY DEFINER) to check membership
CREATE OR REPLACE FUNCTION public.is_active_member(p_org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = auth.uid()
        AND org_id = p_org_id
        AND status = 'active'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_org_role(p_org_id UUID, p_roles TEXT[])
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = auth.uid()
        AND org_id = p_org_id
        AND role = ANY(p_roles)
        AND status = 'active'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Drop the recursive policy and replace it
DROP POLICY IF EXISTS "Members can view own org memberships" ON public.memberships;

CREATE POLICY "Users can view own memberships"
    ON public.memberships FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Members can view org memberships"
    ON public.memberships FOR SELECT
    USING (public.is_active_member(org_id));

-- Also rewrite UPDATE/DELETE policies that referenced memberships from within
-- (they're not recursive in same way but use same anti-pattern; switch to helpers).
DROP POLICY IF EXISTS "Owner or admin can manage memberships" ON public.memberships;
CREATE POLICY "Owner or admin can manage memberships"
    ON public.memberships FOR UPDATE
    USING (public.has_org_role(org_id, ARRAY['owner','admin']));

DROP POLICY IF EXISTS "Users can leave or owner/admin can remove" ON public.memberships;
CREATE POLICY "Users can leave or owner/admin can remove"
    ON public.memberships FOR DELETE
    USING (
        auth.uid() = user_id
        OR public.has_org_role(org_id, ARRAY['owner','admin'])
    );
