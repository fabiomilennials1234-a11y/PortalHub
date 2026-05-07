"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { uploadImage } from "@/actions/uploads"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  bucket: "avatars" | "banners" | "covers"
  orgId?: string
  value?: string | null
  onChange: (url: string | null) => void
  aspectRatio?: "square" | "video" | "wide"
  label?: string
  className?: string
}

const ASPECT_CLASSES = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
} as const

export function ImageUpload({
  bucket,
  orgId,
  value,
  onChange,
  aspectRatio = "square",
  label = "Imagem",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set("bucket", bucket)
      formData.set("file", file)
      if (orgId) formData.set("org_id", orgId)

      const result = await uploadImage(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.data?.url) onChange(result.data.url)
      if (inputRef.current) inputRef.current.value = ""
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleSelect}
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-dashed border-border bg-muted/30",
          ASPECT_CLASSES[aspectRatio],
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              className="absolute top-1.5 right-1.5"
              onClick={() => onChange(null)}
              disabled={isPending}
            >
              <X />
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:bg-muted/50"
          >
            {isPending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Upload className="size-6" />
            )}
            <span className="text-xs">
              {isPending ? "Enviando..." : "Clique pra enviar"}
            </span>
          </button>
        )}
      </div>

      {value && !isPending && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="w-full"
        >
          <Upload className="size-3.5" />
          Trocar imagem
        </Button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
