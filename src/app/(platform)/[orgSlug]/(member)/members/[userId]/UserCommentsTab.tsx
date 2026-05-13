"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserCommentsTabProps {
  orgSlug: string
  userId: string
  limit?: number
}

interface CommentRow {
  id: string
  body: unknown
  created_at: string
  post_id: string
  post_title: string | null
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  return `${months}mo`
}

function extractText(node: unknown): string {
  if (!node) return ""
  if (typeof node === "string") return node
  if (typeof node !== "object") return ""
  const n = node as Record<string, unknown>
  if (n.type === "text" && typeof n.text === "string") return n.text
  if (Array.isArray(n.content)) return n.content.map(extractText).join(" ")
  return ""
}

export function UserCommentsTab({
  orgSlug,
  userId,
  limit = 10,
}: UserCommentsTabProps) {
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["user-comments", userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, body, created_at, post_id, posts:post_id(title)")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      type Row = {
        id: string
        body: unknown
        created_at: string
        post_id: string
        posts: { title: string } | null
      }

      return ((data ?? []) as unknown as Row[]).map<CommentRow>((r) => ({
        id: r.id,
        body: r.body,
        created_at: r.created_at,
        post_id: r.post_id,
        post_title: r.posts?.title ?? null,
      }))
    },
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-5 animate-spin text-ink-low" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mid">
        nenhuma resposta ainda
      </div>
    )
  }

  return (
    <ul className="divide-y divide-line-faint">
      {data.map((c) => {
        const text = extractText(c.body).slice(0, 200)
        return (
          <li key={c.id} className="py-3">
            <Link
              href={`/${orgSlug}/community/${c.post_id}`}
              className="group block space-y-1"
            >
              <p className="font-serif text-[14px] italic leading-relaxed text-ink-soft">
                {text || "(sem conteudo)"}
              </p>
              <p className="flex flex-wrap items-center gap-x-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid">
                <span>em</span>
                <span className="truncate normal-case tracking-normal text-foreground transition-colors group-hover:text-gold-dk">
                  {c.post_title ?? "post"}
                </span>
                <span className="text-ink-low">·</span>
                <span className="tabular-nums">{timeAgo(c.created_at)}</span>
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
