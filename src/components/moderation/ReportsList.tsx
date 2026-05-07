"use client"

import { useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Flag, Check, X } from "lucide-react"
import { useReports } from "@/hooks/useReports"
import { resolveReport } from "@/actions/reports"
import type { ReportStatus } from "@/types/domain"

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Assédio",
  hate_speech: "Discurso de ódio",
  inappropriate: "Inapropriado",
  misinformation: "Desinformação",
  other: "Outro",
}

const STATUS_VARIANTS: Record<
  ReportStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "destructive",
  reviewing: "default",
  resolved: "secondary",
  dismissed: "outline",
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pendente",
  reviewing: "Revisando",
  resolved: "Resolvido",
  dismissed: "Ignorado",
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

interface ReportsListProps {
  orgId: string
}

export function ReportsList({ orgId }: ReportsListProps) {
  const [filter, setFilter] = useState<ReportStatus | "all">("pending")
  const { data: reports, isLoading } = useReports({
    orgId,
    status: filter === "all" ? undefined : filter,
  })
  const queryClient = useQueryClient()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleResolve(reportId: string, status: "resolved" | "dismissed") {
    setPendingId(reportId)
    startTransition(async () => {
      const formData = new FormData()
      formData.set("report_id", reportId)
      formData.set("status", status)
      await resolveReport(formData)
      queryClient.invalidateQueries({ queryKey: ["reports", orgId] })
      setPendingId(null)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {(["pending", "reviewing", "resolved", "dismissed", "all"] as const).map(
          (s) => (
            <Button
              key={s}
              variant={filter === s ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Todos" : STATUS_LABELS[s]}
            </Button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : !reports || reports.length === 0 ? (
        <p className="py-8 text-center text-xs text-muted-foreground">
          Nenhuma denúncia.
        </p>
      ) : (
        <div className="space-y-2">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      {r.reporter.avatar_url && (
                        <AvatarImage src={r.reporter.avatar_url} />
                      )}
                      <AvatarFallback>
                        {getInitials(r.reporter.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium">
                        {r.reporter.full_name ?? "Anônimo"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Reportou {r.target_type} · {REASON_LABELS[r.reason]}
                      </p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANTS[r.status]}>
                    {STATUS_LABELS[r.status]}
                  </Badge>
                </div>

                {r.description && (
                  <p className="text-xs text-muted-foreground">
                    {r.description}
                  </p>
                )}

                {(r.status === "pending" || r.status === "reviewing") && (
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      variant="default"
                      disabled={pendingId === r.id}
                      onClick={() => handleResolve(r.id, "resolved")}
                    >
                      <Check className="size-3" />
                      Resolver
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={pendingId === r.id}
                      onClick={() => handleResolve(r.id, "dismissed")}
                    >
                      <X className="size-3" />
                      Ignorar
                    </Button>
                    {pendingId === r.id && (
                      <Loader2 className="size-3 animate-spin self-center" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!reports || reports.length === 0) && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Flag className="size-6 text-muted-foreground/50" />
        </div>
      )}
    </div>
  )
}
