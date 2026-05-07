"use server"

import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { headers } from "next/headers"

const createPlanSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  price_cents: z.coerce.number().int().min(0),
  currency: z.string().length(3).default("usd"),
  interval: z.enum(["month", "year"]).default("month"),
  features: z.string().optional(),
})

const updatePlanSchema = z.object({
  plan_id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price_cents: z.coerce.number().int().min(0).optional(),
  features: z.string().optional(),
  active: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
})

const planIdSchema = z.object({
  plan_id: z.string().uuid(),
})

const checkoutSchema = z.object({
  plan_id: z.string().uuid(),
  org_slug: z.string().min(1),
})

const portalSchema = z.object({
  org_slug: z.string().min(1),
})

// ── Plan management (admin) ──────────────────────────────────

export async function createPlan(formData: FormData) {
  const parsed = createPlanSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  let featuresJson: unknown = []
  if (parsed.data.features) {
    try {
      featuresJson = JSON.parse(parsed.data.features)
    } catch {
      return { error: "Features inválidas (JSON)" }
    }
  }

  const supabase = await createClient()

  // Create Stripe product + price
  let stripeProductId: string | null = null
  let stripePriceId: string | null = null

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const product = await stripe.products.create({
        name: parsed.data.name,
        description: parsed.data.description || undefined,
      })
      stripeProductId = product.id

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: parsed.data.price_cents,
        currency: parsed.data.currency,
        recurring: { interval: parsed.data.interval },
      })
      stripePriceId = price.id
    } catch (err) {
      return {
        error: `Erro ao criar produto no Stripe: ${
          err instanceof Error ? err.message : "desconhecido"
        }`,
      }
    }
  }

  const { data, error } = await supabase
    .from("plans")
    .insert({
      org_id: parsed.data.org_id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_cents: parsed.data.price_cents,
      currency: parsed.data.currency,
      interval: parsed.data.interval,
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
      features: featuresJson as never,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updatePlan(formData: FormData) {
  const parsed = updatePlanSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.name) updateData.name = parsed.data.name
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null
  if (parsed.data.price_cents !== undefined)
    updateData.price_cents = parsed.data.price_cents
  if (parsed.data.features) {
    try {
      updateData.features = JSON.parse(parsed.data.features)
    } catch {
      return { error: "Features inválidas (JSON)" }
    }
  }
  if (parsed.data.active !== undefined) updateData.active = parsed.data.active

  const { error } = await supabase
    .from("plans")
    .update(updateData)
    .eq("id", parsed.data.plan_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function archivePlan(formData: FormData) {
  const parsed = planIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("plans")
    .update({ active: false })
    .eq("id", parsed.data.plan_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

// ── Checkout / Billing Portal ────────────────────────────────

export async function createCheckoutSession(formData: FormData) {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe não configurado" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", parsed.data.plan_id)
    .single()

  if (!plan || !plan.stripe_price_id) {
    return { error: "Plano não disponível" }
  }

  // Reuse customer if user already has subscription
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .eq("org_id", plan.org_id)
    .maybeSingle()

  const headersList = await headers()
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      customer: existing?.stripe_customer_id ?? undefined,
      customer_email: existing?.stripe_customer_id ? undefined : user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        org_id: plan.org_id,
        plan_id: plan.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          org_id: plan.org_id,
          plan_id: plan.id,
        },
      },
      success_url: `${origin}/${parsed.data.org_slug}/settings/billing?success=1`,
      cancel_url: `${origin}/${parsed.data.org_slug}/pricing?canceled=1`,
    })

    return { data: { url: session.url } }
  } catch (err) {
    return {
      error: `Erro no checkout: ${
        err instanceof Error ? err.message : "desconhecido"
      }`,
    }
  }
}

export async function createBillingPortalSession(formData: FormData) {
  const parsed = portalSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe não configurado" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", parsed.data.org_slug)
    .single()
  if (!org) return { error: "Organização não encontrada" }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .eq("org_id", org.id)
    .maybeSingle()

  if (!subscription?.stripe_customer_id) {
    return { error: "Sem assinatura ativa" }
  }

  const headersList = await headers()
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/${parsed.data.org_slug}/settings/billing`,
    })
    return { data: { url: session.url } }
  } catch (err) {
    return {
      error: `Erro no portal: ${
        err instanceof Error ? err.message : "desconhecido"
      }`,
    }
  }
}
