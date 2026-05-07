import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/stripe/admin"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret não configurado" },
      { status: 500 },
    )
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura ausente" },
      { status: 400 },
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json(
      {
        error: `Assinatura inválida: ${
          err instanceof Error ? err.message : "desconhecido"
        }`,
      },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const orgId = session.metadata?.org_id
        const planId = session.metadata?.plan_id
        const subscriptionId = session.subscription as string | null
        const customerId = session.customer as string | null

        if (!userId || !orgId || !subscriptionId) break

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId)
        const item = subscription.items.data[0]

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            org_id: orgId,
            plan_id: planId ?? null,
            status: subscription.status,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            current_period_start: item?.current_period_start
              ? new Date(item.current_period_start * 1000).toISOString()
              : null,
            current_period_end: item?.current_period_end
              ? new Date(item.current_period_end * 1000).toISOString()
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          },
          { onConflict: "user_id,org_id" },
        )
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id
        const orgId = subscription.metadata?.org_id
        const planId = subscription.metadata?.plan_id

        if (!userId || !orgId) break

        const item = subscription.items.data[0]

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            org_id: orgId,
            plan_id: planId ?? null,
            status: subscription.status,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            current_period_start: item?.current_period_start
              ? new Date(item.current_period_start * 1000).toISOString()
              : null,
            current_period_end: item?.current_period_end
              ? new Date(item.current_period_end * 1000).toISOString()
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          },
          { onConflict: "user_id,org_id" },
        )
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (
          invoice as Stripe.Invoice & { subscription?: string | null }
        ).subscription as string | null
        const userId = invoice.metadata?.user_id ?? null
        const orgId = invoice.metadata?.org_id ?? null

        let resolvedUserId = userId
        let resolvedOrgId = orgId
        let internalSubId: string | null = null

        if (subscriptionId) {
          const { data: sub } = await supabase
            .from("subscriptions")
            .select("id, user_id, org_id")
            .eq("stripe_subscription_id", subscriptionId)
            .maybeSingle()
          if (sub) {
            internalSubId = sub.id
            resolvedUserId = resolvedUserId ?? sub.user_id
            resolvedOrgId = resolvedOrgId ?? sub.org_id
          }
        }

        if (!resolvedUserId || !resolvedOrgId) break

        const status =
          event.type === "invoice.payment_succeeded" ? "succeeded" : "failed"

        await supabase.from("payments").upsert(
          {
            user_id: resolvedUserId,
            org_id: resolvedOrgId,
            subscription_id: internalSubId,
            stripe_invoice_id: invoice.id,
            amount_cents: invoice.amount_paid ?? invoice.amount_due ?? 0,
            currency: invoice.currency,
            status,
            invoice_url: invoice.hosted_invoice_url ?? null,
            paid_at:
              status === "succeeded" && invoice.status_transitions?.paid_at
                ? new Date(
                    invoice.status_transitions.paid_at * 1000,
                  ).toISOString()
                : null,
          },
          { onConflict: "stripe_invoice_id" },
        )
        break
      }

      default:
        break
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: `Erro processando evento: ${
          err instanceof Error ? err.message : "desconhecido"
        }`,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ received: true })
}
