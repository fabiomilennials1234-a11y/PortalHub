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

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escreva algo...",
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
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[80px] px-3 py-2",
          minimal && "min-h-[60px]",
        ),
      },
    },
  })

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      <div className="flex flex-wrap gap-0.5 border-b border-border p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") && "bg-muted")}
        >
          <Bold />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") && "bg-muted")}
        >
          <Italic />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") && "bg-muted")}
        >
          <List />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") && "bg-muted")}
        >
          <ListOrdered />
        </Button>
        {!minimal && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 2 }) && "bg-muted",
              )}
            >
              <Heading2 />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(editor.isActive("blockquote") && "bg-muted")}
            >
              <Quote />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn(editor.isActive("codeBlock") && "bg-muted")}
            >
              <Code />
            </Button>
          </>
        )}
        <div className="ml-auto flex gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
