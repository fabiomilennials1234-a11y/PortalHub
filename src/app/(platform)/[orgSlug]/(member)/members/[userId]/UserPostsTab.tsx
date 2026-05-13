"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserPostsTabProps {
  orgId: string
  orgSlug: string
  userId: string
  limit?: number
}

interface PostRow {
  id: string
  title: string
  created_at: string
  likes_count: number
  comments_count: number
  category: { name: string; color: string } | null
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

export function UserPostsTab({
  orgId,
  orgSlug,
  userId,
  limit = 10,
}: UserPostsTabProps) {
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ["user-posts", orgId, userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, title, created_at, likes_count, comments_count, categories:category_id(name, color)",
        )
        .eq("org_id", orgId)
        .eq("author_id", userId)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      type Row = {
        id: string
        title: string
        created_at: string
        likes_count: number
        comments_count: number
        categories: { name: string; color: string } | null
      }

      return ((data ?? []) as unknown as Row[]).map<PostRow>((r) => ({
        id: r.id,
        title: r.title,
        created_at: r.created_at,
        likes_count: r.likes_count,
        comments_count: r.comments_count,
        category: r.categories,
      }))
    },
    enabled: !!orgId && !!userId,
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
        nenhum post ainda
      </div>
    )
  }

  return (
    <ul className="divide-y divide-line-faint">
      {data.map((p) => (
        <li key={p.id} className="py-3">
          <Link
            href={`/${orgSlug}/community/${p.id}`}
            className="group block space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2">
              {p.category && (
                <span className="wf-pill !px-1.5 !py-0.5 !text-[10px]">
                  {p.category.name}
                </span>
              )}
              <h4 className="flex-1 font-serif text-[17px] font-medium leading-snug tracking-[-0.005em] text-foreground transition-colors group-hover:text-gold-dk">
                {p.title}
              </h4>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mid tabular-nums">
                {timeAgo(p.created_at)}
              </span>
            </div>
            <p className="text-[12px] text-ink-mid tabular-nums">
              <span className="text-ink-soft">↑ {p.likes_count}</span>
              <span className="mx-1.5 text-ink-low">·</span>
              <span>{p.comments_count} resp.</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
