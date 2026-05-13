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
import { Plus, Loader2 } from "lucide-react"
import type { Category } from "@/types/database.types"

interface PostFormProps {
  orgId: string
  categories: Category[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

export function PostForm({
  orgId,
  categories,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
}: PostFormProps) {
  const [openInternal, setOpenInternal] = useState(false)
  const open = openProp ?? openInternal
  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next)
    else setOpenInternal(next)
  }
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
      {!hideTrigger && (
        <DialogTrigger
          render={
            <Button className="gap-1.5 bg-ink text-paper hover:bg-ink-soft">
              <Plus className="h-4 w-4" />
              <span className="font-medium">Novo post</span>
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="space-y-1">
          <span className="wf-mono">// novo post</span>
          <DialogTitle className="wf-hand text-[26px]">
            Compartilhe um case…
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="post-title" className="wf-mono">
              Titulo
            </Label>
            <Input
              id="post-title"
              placeholder="O que voce quer discutir?"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              maxLength={200}
              className="border-line bg-paper font-serif !text-[18px] placeholder:text-ink-low focus-visible:border-ink-low"
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="post-category" className="wf-mono">
                Categoria
              </Label>
              <select
                id="post-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-line bg-paper px-3 text-[13.5px] text-foreground transition-colors focus:border-ink-low focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="">sem categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="wf-mono">Conteudo</Label>
            <RichTextEditor
              content={body}
              onChange={setBody}
              placeholder="Conte a historia — contexto, decisao, resultado."
            />
          </div>
        </div>

        <DialogFooter className="mt-2 flex items-center justify-between gap-3 sm:justify-between">
          <span className="wf-mono text-ink-low">
            posts uteis rendem ate +25 creditos
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="wf-mono"
            >
              cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !title.trim() || !body}
            >
              {isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              {isPending ? "Publicando…" : "Postar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
