import Link from "next/link"
import { MessageSquare, Pin, Heart, Flame } from "lucide-react"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { cn } from "@/lib/utils"
import type { PostWithAuthor } from "@/types/domain"

interface PostCardProps {
  post: PostWithAuthor
  orgSlug: string
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
  if (!node || typeof node !== "object") return ""
  const n = node as Record<string, unknown>
  if (n.type === "text" && typeof n.text === "string") return n.text
  if (Array.isArray(n.content)) {
    return n.content.map(extractText).join(" ")
  }
  return ""
}

function getPlainText(body: unknown): string {
  return extractText(body).slice(0, 280)
}

function isTrending(post: PostWithAuthor): boolean {
  if (post.likes_count < 10) return false
  const ageMs = Date.now() - new Date(post.created_at).getTime()
  return ageMs < 24 * 60 * 60 * 1000
}

export function PostCard({ post, orgSlug }: PostCardProps) {
  const preview = getPlainText(post.body)
  const trending = isTrending(post)
  const pinned = post.pinned
  const category = post.categories

  return (
    <Link href={`/${orgSlug}/community/${post.id}`} className="group block">
      <article
        className={cn(
          "wf-box wf-box--hover relative px-5 py-4 transition-colors",
          pinned && "border-ink bg-gold-bg/40",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <GradientAvatar
            userId={post.author_id}
            name={post.profiles.full_name}
            avatarUrl={post.profiles.avatar_url}
            size={32}
            ringClassName="ring-1 ring-border"
          />
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[12.5px]">
            <span className="truncate font-medium text-foreground">
              {post.profiles.full_name ?? "Anônimo"}
            </span>
            <span className="wf-mono !text-[10px] !text-ink-low">·</span>
            <span className="wf-mono shrink-0 !text-[10px]">
              TIER {Math.max(1, Math.min(15, Math.floor((post.likes_count + post.comments_count) / 5) + 1))}
            </span>
          </div>
          {category && (
            <span className="wf-pill shrink-0 !text-[10.5px]">{category.name}</span>
          )}
          {pinned && (
            <span className="wf-pill wf-pill--gold shrink-0 !text-[10px]">
              <Pin className="h-2.5 w-2.5" />
              Fixado
            </span>
          )}
          <span className="wf-mono shrink-0 !text-[10px] !text-ink-low">
            {timeAgo(post.created_at)}
          </span>
        </div>

        <h3 className="wf-hand mt-2.5 text-[20px]">{post.title}</h3>
        {preview && (
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">
            {preview}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-mid">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 transition-colors group-hover:text-gold-dk" />
            <span className="tabular-nums font-medium text-ink-soft">
              {post.likes_count}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 transition-colors group-hover:text-ink-soft" />
            <span className="tabular-nums font-medium text-ink-soft">
              {post.comments_count}
            </span>
            <span className="text-ink-low">resp.</span>
          </span>
          {trending && (
            <span className="inline-flex items-center gap-1 text-gold-dk">
              <Flame className="h-3 w-3" />
              <span className="wf-mono !text-[10px] !text-gold-dk">em alta</span>
            </span>
          )}
          <span className="ml-auto hidden wf-mono !text-[10px] !text-ink-low sm:inline">
            +8 créditos ao responder
          </span>
        </div>
      </article>
    </Link>
  )
}
