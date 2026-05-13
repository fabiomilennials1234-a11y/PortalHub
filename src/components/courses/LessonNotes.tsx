"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { LessonNote } from "@/types/domain"

interface LessonNotesProps {
  lessonId: string
  userId: string
}

const MAX_LENGTH = 10000
const AUTOSAVE_DELAY_MS = 800
const SAVED_FADE_MS = 2000

type Status = "idle" | "saving" | "saved" | "error"

export function LessonNotes({ lessonId, userId }: LessonNotesProps) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const queryKey = ["lesson-note", lessonId, userId] as const

  const { data: note, isLoading } = useQuery<LessonNote | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_notes")
        .select("id, user_id, lesson_id, body, created_at, updated_at")
        .eq("lesson_id", lessonId)
        .eq("user_id", userId)
        .maybeSingle()
      if (error) throw error
      return (data as LessonNote | null) ?? null
    },
    enabled: !!lessonId && !!userId,
  })

  const [body, setBody] = useState<string>("")
  const [status, setStatus] = useState<Status>("idle")
  const lastSavedRef = useRef<string>("")
  const dirtyRef = useRef<boolean>(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate local state when the fetched note arrives or changes.
  useEffect(() => {
    if (dirtyRef.current) return
    const next = note?.body ?? ""
    setBody(next)
    lastSavedRef.current = next
  }, [note])

  const upsertMutation = useMutation({
    mutationFn: async (nextBody: string) => {
      const { error } = await supabase
        .from("lesson_notes")
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            body: nextBody,
          },
          { onConflict: "user_id,lesson_id" },
        )
      if (error) throw error
      return nextBody
    },
    onSuccess: (savedBody) => {
      lastSavedRef.current = savedBody
      dirtyRef.current = false
      setStatus("saved")
      queryClient.invalidateQueries({ queryKey })
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = setTimeout(() => {
        setStatus((current) => (current === "saved" ? "idle" : current))
      }, SAVED_FADE_MS)
    },
    onError: (err: unknown) => {
      setStatus("error")
      const message =
        err instanceof Error ? err.message : "Erro ao salvar nota"
      toast.error("Falha ao salvar anotação", { description: message })
    },
  })

  // Debounced autosave: schedule write 800ms after the last keystroke.
  useEffect(() => {
    if (!userId || !lessonId) return
    if (body === lastSavedRef.current) return
    if (body.length > MAX_LENGTH) return

    dirtyRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setStatus("saving")
      upsertMutation.mutate(body)
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // upsertMutation is stable per render; intentionally only watching body.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, lessonId, userId])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="wf-box flex flex-col gap-3 bg-paper p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-paper-2" />
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-paper-2" />
      </div>
    )
  }

  const isEmptyAndUntouched = body.length === 0 && !dirtyRef.current

  return (
    <div className="wf-box flex flex-col gap-3 bg-paper p-6">
      {isEmptyAndUntouched && (
        <p className="font-serif text-[14.5px] italic leading-[1.65] text-ink-low">
          Suas anotações aparecem aqui.
        </p>
      )}

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="Escreva suas anotações sobre esta lição…"
        className="min-h-[200px] resize-y bg-transparent"
        maxLength={MAX_LENGTH}
      />

      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em]">
        <span
          className={cn(
            "transition-opacity",
            status === "saving" && "text-ink-low",
            status === "saved" && "text-success",
            status === "error" && "text-destructive",
            status === "idle" && "opacity-0",
          )}
          aria-live="polite"
        >
          {status === "saving" && "salvando…"}
          {status === "saved" && "salvo"}
          {status === "error" && "erro ao salvar"}
          {status === "idle" && "·"}
        </span>
        <span className="tabular-nums text-ink-low">
          {body.length} / {MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}
