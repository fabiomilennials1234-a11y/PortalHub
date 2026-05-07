"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Flag, Loader2 } from "lucide-react"
import { submitReport } from "@/actions/reports"
import type { ReportReason, ReportTargetType } from "@/types/domain"

interface ReportButtonProps {
  orgId: string
  targetType: ReportTargetType
  targetId: string
  size?: "xs" | "sm"
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Assédio" },
  { value: "hate_speech", label: "Discurso de ódio" },
  { value: "inappropriate", label: "Conteúdo inapropriado" },
  { value: "misinformation", label: "Desinformação" },
  { value: "other", label: "Outro" },
]

export function ReportButton({
  orgId,
  targetType,
  targetId,
  size = "xs",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>("spam")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("org_id", orgId)
      formData.set("target_type", targetType)
      formData.set("target_id", targetId)
      formData.set("reason", reason)
      formData.set("description", description)
      const result = await submitReport(formData)
      if (result.data) {
        setSubmitted(true)
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setDescription("")
          setReason("spam")
        }, 1500)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size={size}
            className="text-muted-foreground"
          >
            <Flag className="size-3" />
            Reportar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar conteúdo</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <p className="py-4 text-center text-sm text-emerald-500">
            Denúncia enviada. Os moderadores foram notificados.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-reason">Motivo</Label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-desc">Detalhes (opcional)</Label>
              <Textarea
                id="report-desc"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
        )}
        {!submitted && (
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Enviar denúncia
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
