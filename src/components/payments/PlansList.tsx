"use client"

import { PlanCard } from "./PlanCard"
import { usePlans } from "@/hooks/usePlans"
import { useSubscription } from "@/hooks/useSubscription"
import { Loader2, Tag } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

interface PlansListProps {
  orgId: string
  orgSlug: string
}

export function PlansList({ orgId, orgSlug }: PlansListProps) {
  const { data: plans, isLoading } = usePlans(orgId)
  const { data: subscription } = useSubscription(orgId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!plans || plans.length === 0) {
    return (
      <EmptyState
        icon={Tag}
        title="Sem planos disponíveis"
        description="A organização ainda não cadastrou planos pagos."
      />
    )
  }

  const currentPlanId =
    subscription?.status === "active" ? subscription.plan_id : null
  const middleIndex = plans.length === 3 ? 1 : -1

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, idx) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          orgSlug={orgSlug}
          isCurrent={plan.id === currentPlanId}
          highlighted={idx === middleIndex}
        />
      ))}
    </div>
  )
}
