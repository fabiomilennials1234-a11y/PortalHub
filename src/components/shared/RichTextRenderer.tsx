import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"

interface RichTextRendererProps {
  content: unknown
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content || typeof content !== "object") {
    return null
  }

  const html = generateHTML(
    content as Parameters<typeof generateHTML>[0],
    [StarterKit],
  )

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
