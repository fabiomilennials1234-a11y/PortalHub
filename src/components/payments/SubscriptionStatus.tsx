"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import type { SubscriptionStatus as SubStatus } from "@/types/domain"

interface SubscriptionStatusProps {
  orgId: string
  orgSlug: string
}

type StatusKind = "ok" | "warning" | "neutral" | "destructive"

const STATUS_META: Record<
  SubStatus,
  {
    label: string
    icon: typeof CheckCircle2
    kind: StatusKind
  }
> = {
  active: { label: "Ativa", icon: CheckCircle2, kind: "ok" },
  trialing: { label: "Em trial", icon: Clock, kind: "ok" },
  past_due: {
    label: "Pagamento atrasado",
    icon: AlertTriangle,
    kind: "destructive",
  },
  unpaid: {
    label: "Não paga",
    icon: AlertTriangle,
    kind: "destructive",
  },
  incomplete: { label: "Incompleta", icon: Clock, kind: "neutral" },
  canceled: { label: "Cancelada", icon: XCircle, kind: "destructive" },
}

const KIND_PILL: Record<StatusKind, string> = {
  ok: "wf-pill wf-pill--gold",
  warning: "wf-pill wf-pill--gold",
  neutral: "wf-pill",
  destructive:
    "wf-pill border-destructive bg-destructive/10 text-destructive",
}

const KIND_ICON: Record<StatusKind, string> = {
  ok: "text-gold-dk",
  warning: "text-gold-dk",
  neutral: "text-ink-mid",
  destructive: "text-destructive",
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
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
      <div className="wf-box flex items-center justify-center py-10">
        <Loader2 className="size-5 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="wf-box space-y-2 p-6">
        <p className="wf-mono">Status</p>
        <h3 className="font-serif text-[18px] font-semibold text-foreground">
          Sem assinatura ativa
        </h3>
        <p className="text-[13px] text-ink-mid">
          Você ainda não assinou nenhum plano nesta comunidade.
        </p>
      </div>
    )
  }

  const meta = STATUS_META[sub.status]
  const Icon = meta.icon

  return (
    <div className="wf-box space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", KIND_ICON[meta.kind])} />
          <span
            className={cn(
              KIND_PILL[meta.kind],
              "text-[10px] uppercase tracking-[0.08em]",
            )}
          >
            {meta.label}
          </span>
        </div>
        {sub.cancel_at_period_end && (
          <span className="wf-pill text-[10px] uppercase tracking-[0.08em]">
            Cancela ao fim do período
          </span>
        )}
      </div>

      {sub.plan && (
        <div className="space-y-1">
          <p className="wf-mono">Plano contratado</p>
          <h3 className="font-serif text-[22px] font-semibold leading-tight text-foreground">
            {sub.plan.name}
          </h3>
          <p className="font-mono text-[12px] text-ink-mid tabular-nums">
            {formatPrice(sub.plan.price_cents, sub.plan.currency)} /{" "}
            {sub.plan.interval === "year" ? "ano" : "mês"}
          </p>
        </div>
      )}

      {sub.current_period_end && (
        <div className="border-t border-line-soft pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
            {sub.cancel_at_period_end
              ? "Acesso até"
              : "Próxima cobrança"}{" "}
            <span className="text-foreground">
              {formatDate(sub.current_period_end)}
            </span>
          </p>
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
        Gerenciar no Stripe →
      </Button>
    </div>
  )
}
