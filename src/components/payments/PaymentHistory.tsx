"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/stripe/format"
import { usePayments } from "@/hooks/usePayments"
import { cn } from "@/lib/utils"

const STATUS_VARIANTS = {
  succeeded: "default",
  pending: "outline",
  failed: "destructive",
  refunded: "secondary",
} as const

const STATUS_LABELS = {
  succeeded: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  refunded: "Reembolsado",
} as const

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
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
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        Sem histórico de pagamentos.
      </p>
    )
  }

  return (
    <Card>
      <CardContent className="divide-y divide-border py-0">
        {payments.map((p) => {
          const variant = STATUS_VARIANTS[p.status]
          return (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between py-3",
              )}
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium tabular-nums">
                  {formatPrice(p.amount_cents, p.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.paid_at
                    ? formatDate(p.paid_at)
                    : formatDate(p.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={variant}>{STATUS_LABELS[p.status]}</Badge>
                {p.invoice_url && (
                  <a
                    href={p.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
