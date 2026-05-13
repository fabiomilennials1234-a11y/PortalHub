import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"

interface RichTextRendererProps {
  content: unknown
  className?: string
}

const PROSE_CLASSES = [
  "prose prose-sm max-w-none",
  "prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-h1:text-[28px] prose-h2:text-[22px] prose-h3:text-[18px]",
  "prose-p:text-ink-soft prose-p:leading-relaxed",
  "prose-strong:text-foreground prose-strong:font-medium",
  "prose-em:text-foreground",
  "prose-blockquote:border-l-2 prose-blockquote:border-gold prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-ink-soft",
  "prose-code:bg-paper-2 prose-code:rounded-sm prose-code:px-1 prose-code:py-px prose-code:font-mono prose-code:text-[12.5px] prose-code:text-foreground prose-code:before:hidden prose-code:after:hidden",
  "prose-pre:bg-paper-2 prose-pre:border prose-pre:border-line prose-pre:text-ink",
  "prose-a:text-gold-dk prose-a:no-underline hover:prose-a:underline",
  "prose-li:text-ink-soft prose-li:marker:text-ink-low",
  "prose-hr:border-line-soft",
  "prose-img:rounded-sm prose-img:border prose-img:border-line",
].join(" ")

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
      className={cn(PROSE_CLASSES, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
