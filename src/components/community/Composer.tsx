"use client"

import { useState } from "react"
import { Paperclip, Mic } from "lucide-react"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { Button } from "@/components/ui/button"
import { PostForm } from "@/components/community/PostForm"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/database.types"

interface ComposerProps {
  orgId: string
  categories: Category[]
  userId: string
  fullName: string | null
  avatarUrl: string | null
}

export function Composer({
  orgId,
  categories,
  userId,
  fullName,
  avatarUrl,
}: ComposerProps) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Compartilhe um case, dúvida ou aprendizado"
        onClick={handleOpen}
        onKeyDown={handleKey}
        className={cn(
          "wf-box wf-box--hover mb-3.5 flex cursor-text items-center gap-3 p-3",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
        )}
      >
        <GradientAvatar
          userId={userId}
          name={fullName}
          avatarUrl={avatarUrl}
          size={32}
        />
        <span className="min-w-0 flex-1 truncate font-sans text-[14px] text-ink-low">
          Compartilhe um case, dúvida ou aprendizado…
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }}
          aria-label="Adicionar anexo"
          className="wf-mono hidden h-7 items-center gap-1 rounded-sm border border-line bg-paper px-2 transition-colors hover:border-ink-low/60 sm:inline-flex"
        >
          <Paperclip className="h-3 w-3" />
          anexo
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }}
          aria-label="Gravar áudio"
          className="wf-mono hidden h-7 items-center gap-1 rounded-sm border border-line bg-paper px-2 transition-colors hover:border-ink-low/60 sm:inline-flex"
        >
          <Mic className="h-3 w-3" />
          áudio
        </button>
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }}
          className="h-7 gap-1.5 bg-ink px-3 text-paper hover:bg-ink-soft"
        >
          <span className="font-medium">Postar</span>
        </Button>
      </div>

      <PostForm
        orgId={orgId}
        categories={categories}
        open={open}
        onOpenChange={setOpen}
        hideTrigger
      />
    </>
  )
}
