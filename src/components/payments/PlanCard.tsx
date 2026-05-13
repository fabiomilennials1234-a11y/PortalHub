"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/stripe/format"
import { createCheckoutSession } from "@/actions/payments"
import { cn } from "@/lib/utils"
import type { PlanWithFeatures, PlanFeature } from "@/types/domain"

interface PlanCardProps {
  plan: PlanWithFeatures
  orgSlug: string
  isCurrent?: boolean
  highlighted?: boolean
}

export function PlanCard({
  plan,
  orgSlug,
  isCurrent,
  highlighted,
}: PlanCardProps) {
  const [isPending, startTransition] = useTransition()

  function handleCheckout() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("plan_id", plan.id)
      formData.set("org_slug", orgSlug)
      const result = await createCheckoutSession(formData)
      if (result.data?.url) {
        window.location.href = result.data.url
      }
    })
  }

  const features = Array.isArray(plan.features)
    ? (plan.features as PlanFeature[])
    : []

  // Format price for editorial display: split currency and amount
  const formatted = formatPrice(plan.price_cents, plan.currency)
  const intervalCaps = plan.interval === "year" ? "ANO" : "MÊS"
  const currencyCaps = plan.currency.toUpperCase()

  return (
    <div
      className={cn(
        "wf-box wf-box--hover relative flex flex-col p-6 transition-colors",
        highlighted && "border-2 border-foreground",
      )}
    >
      {highlighted && (
        <span className="wf-pill wf-pill--gold absolute -top-3 right-6 text-[10px] uppercase tracking-[0.08em]">
          Mais popular
        </span>
      )}

      <div className="space-y-1">
        <h3 className="font-serif text-[22px] font-semibold leading-tight text-foreground">
          {plan.name}
        </h3>
        <p className="wf-mono">Por {intervalCaps.toLowerCase()}</p>
      </div>

      {plan.description && (
        <p className="mt-3 text-[13px] leading-snug text-ink-mid">
          {plan.description}
        </p>
      )}

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-serif text-[48px] font-semibold leading-none tabular-nums tracking-tight text-foreground">
          {formatted}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mid">
          {currencyCaps} / {intervalCaps.toLowerCase()}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((f, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-[13px] leading-snug"
          >
            {f.included ? (
              <Check className="mt-0.5 size-3.5 shrink-0 text-gold-dk" />
            ) : (
              <X className="mt-0.5 size-3.5 shrink-0 text-ink-low" />
            )}
            <span
              className={cn(
                "text-foreground",
                !f.included && "text-ink-low line-through",
              )}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent ? (
          <Button variant="outline" disabled className="w-full">
            Plano atual
          </Button>
        ) : (
          <Button
            variant={highlighted ? "default" : "outline"}
            onClick={handleCheckout}
            disabled={isPending || !plan.stripe_price_id}
            className="w-full"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {plan.stripe_price_id ? "Assinar" : "Indisponível"}
          </Button>
        )}
      </div>
    </div>
  )
}
