"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEnrollment } from "@/hooks/useEnrollment"
import { Loader2, Play, CheckCircle2 } from "lucide-react"

interface EnrollButtonProps {
  courseId: string
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const { isEnrolled, isCompleted, isLoading, enroll, isEnrolling } =
    useEnrollment(courseId)

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="size-4 animate-spin" />
      </Button>
    )
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="size-3" />
          Concluído
        </Badge>
        <Button variant="outline" size="sm">
          <Play className="size-3.5" />
          Revisitar
        </Button>
      </div>
    )
  }

  if (isEnrolled) {
    return (
      <Button>
        <Play className="size-4" />
        Continuar
      </Button>
    )
  }

  return (
    <Button onClick={() => enroll()} disabled={isEnrolling}>
      {isEnrolling ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Play className="size-4" />
      )}
      Começar curso
    </Button>
  )
}
