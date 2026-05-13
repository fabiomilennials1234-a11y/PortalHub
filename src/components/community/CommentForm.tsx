"use client"

import { useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { createComment } from "@/actions/comments"
import { Loader2 } from "lucide-react"

interface CommentFormProps {
  postId: string
  parentId?: string
  onCancel?: () => void
  onSuccess?: () => void
}

export function CommentForm({
  postId,
  parentId,
  onCancel,
  onSuccess,
}: CommentFormProps) {
  const [body, setBody] = useState<unknown>(null)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  function handleSubmit() {
    if (!body) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set("post_id", postId)
      formData.set("body", JSON.stringify(body))
      if (parentId) formData.set("parent_id", parentId)

      const result = await createComment(formData)
      if (result.data) {
        setBody(null)
        queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        onSuccess?.()
      }
    })
  }

  return (
    <div className="space-y-3">
      <RichTextEditor
        content={body}
        onChange={setBody}
        placeholder={
          parentId ? "Responda com algo util…" : "Comente algo util — quanto mais util, mais creditos"
        }
        minimal
      />
      <div className="flex items-center justify-between gap-2">
        <span className="wf-mono text-ink-low">
          quanto mais util · mais creditos
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="wf-mono"
            >
              cancelar
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || !body}
          >
            {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            {parentId ? "Responder" : "Publicar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
