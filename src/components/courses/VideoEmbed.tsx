"use client"

import { extractVideoEmbedUrl } from "@/lib/validators"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

interface VideoEmbedProps {
  url: string
  title?: string
}

export function VideoEmbed({ url, title = "Vídeo" }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const embedUrl = extractVideoEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          URL de vídeo inválida
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
      {!loaded && (
        <Skeleton className="absolute inset-0" />
      )}
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
