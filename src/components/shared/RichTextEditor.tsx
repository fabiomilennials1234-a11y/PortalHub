"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Code,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorProps {
  content?: unknown
  onChange?: (json: unknown) => void
  placeholder?: string
  minimal?: boolean
  className?: string
}

const PROSE_CLASSES = [
  "prose prose-sm max-w-none focus:outline-none",
  "prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-p:text-ink-soft prose-p:leading-relaxed",
  "prose-strong:text-foreground prose-strong:font-medium",
  "prose-em:text-foreground",
  "prose-blockquote:border-l-2 prose-blockquote:border-gold prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-ink-soft prose-blockquote:not-italic",
  "prose-code:bg-paper-2 prose-code:rounded-sm prose-code:px-1 prose-code:py-px prose-code:font-mono prose-code:text-[12.5px] prose-code:text-foreground prose-code:before:hidden prose-code:after:hidden",
  "prose-pre:bg-paper-2 prose-pre:border prose-pre:border-line prose-pre:text-ink",
  "prose-a:text-gold-dk prose-a:no-underline hover:prose-a:underline",
  "prose-li:text-ink-soft prose-li:marker:text-ink-low",
  "prose-hr:border-line-soft",
].join(" ")

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escreva algo…",
  minimal = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: minimal ? false : { levels: [2, 3] },
        blockquote: minimal ? false : undefined,
        codeBlock: minimal ? false : undefined,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: content as Parameters<typeof useEditor>[0] extends { content?: infer C } ? C : never,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getJSON())
    },
    editorProps: {
      attributes: {
        class: cn(
          PROSE_CLASSES,
          "px-4 py-3",
          minimal ? "min-h-[80px]" : "min-h-[200px]",
        ),
      },
    },
  })

  if (!editor) return null

  const toolBtn = (active: boolean) =>
    cn(
      "h-7 w-7 rounded-sm text-ink-mid transition-colors hover:bg-paper hover:text-foreground",
      active && "bg-paper text-foreground ring-1 ring-line",
    )

  return (
    <div
      className={cn(
        "wf-box overflow-hidden bg-paper-2 transition-colors focus-within:border-ink-low",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line-soft bg-paper-2 px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolBtn(editor.isActive("bold"))}
          aria-label="bold"
        >
          <Bold />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolBtn(editor.isActive("italic"))}
          aria-label="italic"
        >
          <Italic />
        </Button>
        <span className="mx-1 h-4 w-px bg-line-soft" />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolBtn(editor.isActive("bulletList"))}
          aria-label="bullet list"
        >
          <List />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolBtn(editor.isActive("orderedList"))}
          aria-label="ordered list"
        >
          <ListOrdered />
        </Button>
        {!minimal && (
          <>
            <span className="mx-1 h-4 w-px bg-line-soft" />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={toolBtn(editor.isActive("heading", { level: 2 }))}
              aria-label="heading"
            >
              <Heading2 />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={toolBtn(editor.isActive("blockquote"))}
              aria-label="quote"
            >
              <Quote />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={toolBtn(editor.isActive("codeBlock"))}
              aria-label="code"
            >
              <Code />
            </Button>
          </>
        )}
        <div className="ml-auto flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={toolBtn(false)}
            aria-label="undo"
          >
            <Undo />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={toolBtn(false)}
            aria-label="redo"
          >
            <Redo />
          </Button>
        </div>
      </div>
      <div className="bg-paper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
