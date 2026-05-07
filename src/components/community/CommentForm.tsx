"use client"

import { useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { createComment } from "@/actions/comments"
import { Send } from "lucide-react"

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
    <div className="space-y-2">
      <RichTextEditor
        content={body}
        onChange={setBody}
        placeholder="Escreva um comentário..."
        minimal
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !body}
        >
          <Send className="size-3.5" />
          Enviar
        </Button>
      </div>
    </div>
  )
}
