"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { formatPrice } from "@/lib/stripe/format"
import { createBillingPortalSession } from "@/actions/payments"
import { useSubscription } from "@/hooks/useSubscription"
import type { SubscriptionStatus as SubStatus } from "@/types/domain"

interface SubscriptionStatusProps {
  orgId: string
  orgSlug: string
}

const STATUS_META: Record<
  SubStatus,
  {
    label: string
    icon: typeof CheckCircle2
    color: string
  }
> = {
  active: {
    label: "Ativa",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  trialing: {
    label: "Em trial",
    icon: Clock,
    color: "text-blue-500",
  },
  past_due: {
    label: "Pagamento atrasado",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  unpaid: {
    label: "Não paga",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  incomplete: {
    label: "Incompleta",
    icon: Clock,
    color: "text-muted-foreground",
  },
  canceled: {
    label: "Cancelada",
    icon: XCircle,
    color: "text-rose-500",
  },
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function SubscriptionStatus({
  orgId,
  orgSlug,
}: SubscriptionStatusProps) {
  const { data: sub, isLoading } = useSubscription(orgId)
  const [isPending, startTransition] = useTransition()

  function handlePortal() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("org_slug", orgSlug)
      const result = await createBillingPortalSession(formData)
      if (result.data?.url) {
        window.location.href = result.data.url
      }
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sub) {
    return (
      <Card>
        <CardContent className="space-y-3 py-5">
          <h3 className="font-heading text-sm font-semibold">
            Sem assinatura ativa
          </h3>
          <p className="text-xs text-muted-foreground">
            Você ainda não assinou nenhum plano nesta comunidade.
          </p>
        </CardContent>
      </Card>
    )
  }

  const meta = STATUS_META[sub.status]
  const Icon = meta.icon

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`size-4 ${meta.color}`} />
            <Badge variant="secondary">{meta.label}</Badge>
          </div>
          {sub.cancel_at_period_end && (
            <Badge variant="outline">Cancela ao fim do período</Badge>
          )}
        </div>

        {sub.plan && (
          <div className="space-y-1">
            <h3 className="font-heading text-base font-semibold">
              {sub.plan.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatPrice(sub.plan.price_cents, sub.plan.currency)} /{" "}
              {sub.plan.interval === "year" ? "ano" : "mês"}
            </p>
          </div>
        )}

        {sub.current_period_end && (
          <div className="text-xs text-muted-foreground">
            {sub.cancel_at_period_end ? "Acesso até" : "Próxima cobrança em"}{" "}
            <span className="font-medium text-foreground">
              {formatDate(sub.current_period_end)}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handlePortal}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ExternalLink className="size-4" />
          )}
          Gerenciar assinatura
        </Button>
      </CardContent>
    </Card>
  )
}
