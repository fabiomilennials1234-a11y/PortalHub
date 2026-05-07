"use client"

import { useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { createPost } from "@/actions/posts"
import { Plus, Send } from "lucide-react"
import type { Category } from "@/types/database.types"

interface PostFormProps {
  orgId: string
  categories: Category[]
}

export function PostForm({ orgId, categories }: PostFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState<unknown>(null)
  const [categoryId, setCategoryId] = useState("")
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  function handleSubmit() {
    if (!title.trim() || !body) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set("org_id", orgId)
      formData.set("title", title.trim())
      formData.set("body", JSON.stringify(body))
      if (categoryId) formData.set("category_id", categoryId)

      const result = await createPost(formData)
      if (result.data) {
        setTitle("")
        setBody(null)
        setCategoryId("")
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ["posts"] })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Novo Post
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Título</Label>
            <Input
              id="post-title"
              placeholder="Título do post..."
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              maxLength={200}
            />
          </div>
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="post-category">Categoria</Label>
              <select
                id="post-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sem categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <RichTextEditor
              content={body}
              onChange={setBody}
              placeholder="Escreva o conteúdo do seu post..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || !body}
          >
            <Send className="size-3.5" />
            {isPending ? "Publicando..." : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
