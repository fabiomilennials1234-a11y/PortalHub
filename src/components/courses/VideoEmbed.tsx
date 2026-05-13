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
      <div className="wf-box flex aspect-video items-center justify-center bg-paper-2">
        <span className="wf-mono !text-ink-mid">URL DE VÍDEO INVÁLIDA</span>
      </div>
    )
  }

  return (
    <div className="wf-box relative aspect-video overflow-hidden bg-[oklch(0.18_0.022_250)]">
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
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
