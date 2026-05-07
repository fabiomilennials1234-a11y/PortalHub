"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const intervalLabel = plan.interval === "year" ? "/ano" : "/mês"

  return (
    <Card
      className={cn(
        "flex flex-col",
        highlighted && "ring-2 ring-primary",
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-4 py-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">
              {plan.name}
            </h3>
            {highlighted && <Badge>Recomendado</Badge>}
          </div>
          {plan.description && (
            <p className="text-xs text-muted-foreground">{plan.description}</p>
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tabular-nums">
              {formatPrice(plan.price_cents, plan.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              {intervalLabel}
            </span>
          </div>
        </div>

        <ul className="flex-1 space-y-1.5 text-xs">
          {features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {f.included ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <X className="size-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  !f.included && "text-muted-foreground line-through",
                )}
              >
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {isCurrent ? (
          <Button variant="secondary" disabled>
            Plano atual
          </Button>
        ) : (
          <Button
            variant={highlighted ? "default" : "outline"}
            onClick={handleCheckout}
            disabled={isPending || !plan.stripe_price_id}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {plan.stripe_price_id ? "Assinar" : "Indisponível"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
