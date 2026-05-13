"use client"

import { VideoEmbed } from "@/components/courses/VideoEmbed"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import type { LessonFull } from "@/types/domain"

interface LessonContentProps {
  lesson: LessonFull
}

export function LessonContent({ lesson }: LessonContentProps) {
  if (
    (lesson.content_type === "video" || lesson.content_type === "embed") &&
    lesson.video_url
  ) {
    return <VideoEmbed url={lesson.video_url} title={lesson.title} />
  }

  if (lesson.content_type === "text" && lesson.text_content) {
    return (
      <div className="wf-box bg-paper p-6">
        <RichTextRenderer content={lesson.text_content} />
      </div>
    )
  }

  return (
    <div className="wf-box flex aspect-video items-center justify-center bg-paper-2">
      <span className="wf-mono !text-ink-mid">CONTEÚDO INDISPONÍVEL</span>
    </div>
  )
}
