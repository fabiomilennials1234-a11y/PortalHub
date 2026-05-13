"use client"

import { ExternalLink, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/stripe/format"
import { usePayments } from "@/hooks/usePayments"
import { cn } from "@/lib/utils"

type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded"

const STATUS_LABELS: Record<PaymentStatus, string> = {
  succeeded: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  refunded: "Reembolsado",
}

const STATUS_PILL: Record<PaymentStatus, string> = {
  succeeded: "wf-pill wf-pill--gold",
  pending: "wf-pill",
  failed: "wf-pill border-destructive bg-destructive/10 text-destructive",
  refunded: "wf-pill",
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

interface PaymentHistoryProps {
  orgId: string
}

export function PaymentHistory({ orgId }: PaymentHistoryProps) {
  const { data: payments, isLoading } = usePayments(orgId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <p className="py-10 text-center font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mid">
        Sem histórico de pagamentos.
      </p>
    )
  }

  return (
    <div className="wf-box overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-line-soft bg-paper-2 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
          Data · valor
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
          Status
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
          Recibo
        </span>
      </div>
      <div className="divide-y divide-line-soft">
        {payments.map((p) => {
          const status = p.status as PaymentStatus
          return (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-[13px]"
            >
              <div className="space-y-0.5">
                <p className="font-medium tabular-nums text-foreground">
                  {formatPrice(p.amount_cents, p.currency)}
                </p>
                <p className="font-mono text-[11px] tabular-nums text-ink-mid">
                  {p.paid_at
                    ? formatDate(p.paid_at)
                    : formatDate(p.created_at)}
                </p>
              </div>
              <span
                className={cn(
                  STATUS_PILL[status],
                  "text-[10px] uppercase tracking-[0.08em]",
                )}
              >
                {STATUS_LABELS[status]}
              </span>
              <div className="flex w-6 justify-end">
                {p.invoice_url ? (
                  <a
                    href={p.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-low transition-colors hover:text-gold-dk"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <span className="text-ink-low">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
