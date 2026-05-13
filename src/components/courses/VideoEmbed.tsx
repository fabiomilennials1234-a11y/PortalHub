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
    <div className="relative aspect-video overflow-hidden rounded-md border border-ink bg-[#1a1816]">
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

      {/* Decorative dark chrome — visual addition over provider iframe.
          Hidden on mobile so native fullscreen / provider UI prevails. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/60 to-transparent px-4 py-3 md:block"
      >
        <div className="h-0.5 w-full bg-white/20">
          <div className="h-full w-[45%] bg-gold" />
        </div>
        <div className="mt-2 flex items-center gap-3 text-white">
          <span className="text-base leading-none">▶</span>
          <span className="wf-mono !text-white/90">14:32 / 22:08</span>
          <div className="flex-1" />
          <span className="wf-mono !text-white/90">1.25×</span>
          <span className="wf-mono !text-white/90">cc</span>
          <span className="wf-mono !text-white/90">⛶</span>
        </div>
      </div>
    </div>
  )
}
