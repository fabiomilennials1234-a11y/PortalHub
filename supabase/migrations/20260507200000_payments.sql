-- =============================================================
-- Sprint 5: Payments — plans, subscriptions, payments
-- =============================================================

-- =============================================================
-- 1. PLANS — subscription tiers per org
-- =============================================================
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'usd',
    interval TEXT NOT NULL DEFAULT 'month' CHECK (interval IN ('month', 'year')),
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    features JSONB NOT NULL DEFAULT '[]',
    active BOOLEAN NOT NULL DEFAULT true,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 2. SUBSCRIPTIONS
-- =============================================================
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'incomplete' CHECK (
        status IN ('incomplete', 'active', 'past_due', 'canceled', 'unpaid', 'trialing')
    ),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    canceled_at TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, org_id)
);

-- =============================================================
-- 3. PAYMENTS — invoice history
-- =============================================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL CHECK (
        status IN ('succeeded', 'failed', 'pending', 'refunded')
    ),
    invoice_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. INDEXES
-- =============================================================
CREATE INDEX idx_plans_org_active ON public.plans(org_id, active, position);
CREATE INDEX idx_plans_stripe_price ON public.plans(stripe_price_id);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_org ON public.subscriptions(org_id);
CREATE INDEX idx_subscriptions_user_org ON public.subscriptions(user_id, org_id);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_org ON public.payments(org_id);
CREATE INDEX idx_payments_subscription ON public.payments(subscription_id);
CREATE INDEX idx_payments_stripe_invoice ON public.payments(stripe_invoice_id);

-- =============================================================
-- 5. TRIGGERS: updated_at
-- =============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================
-- 6. RLS: PLANS
-- =============================================================
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans FORCE ROW LEVEL SECURITY;

-- Members see active plans of their org (pricing page)
CREATE POLICY "Members can view active plans"
    ON public.plans FOR SELECT
    USING (
        active = true
        AND EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = plans.org_id
            AND memberships.status = 'active'
        )
    );

-- Public can view active plans of public orgs (anon pricing page)
-- For MVP, scope to authenticated only — public pricing requires per-org check.

-- Admin sees all plans
CREATE POLICY "Admin can view all plans"
    ON public.plans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = plans.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- Admin manages plans
CREATE POLICY "Admin can manage plans"
    ON public.plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = plans.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- =============================================================
-- 7. RLS: SUBSCRIPTIONS
-- =============================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

-- Users see own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Admin sees all subscriptions in their org
CREATE POLICY "Admin can view org subscriptions"
    ON public.subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = subscriptions.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- No user-level INSERT/UPDATE/DELETE — all writes via webhook (SECURITY DEFINER) or admin server action.

-- =============================================================
-- 8. RLS: PAYMENTS
-- =============================================================
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

-- Users see own payment history
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Admin sees org payment history (analytics/revenue)
CREATE POLICY "Admin can view org payments"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.memberships
            WHERE memberships.user_id = auth.uid()
            AND memberships.org_id = payments.org_id
            AND memberships.role IN ('owner', 'admin')
            AND memberships.status = 'active'
        )
    );

-- No INSERT/UPDATE/DELETE — only webhook writes (SECURITY DEFINER).
