import Link from "next/link"
import { MessageSquare, Pin } from "lucide-react"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { PostWithAuthor } from "@/types/domain"

interface PostCardProps {
  post: PostWithAuthor
  orgSlug: string
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  )
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
  return extractText(body).slice(0, 200)
}

export function PostCard({ post, orgSlug }: PostCardProps) {
  const preview = getPlainText(post.body)

  return (
    <Link href={`/${orgSlug}/community/${post.id}`}>
      <Card className="transition-colors hover:bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              {post.profiles.avatar_url && (
                <AvatarImage src={post.profiles.avatar_url} />
              )}
              <AvatarFallback>
                {getInitials(post.profiles.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {post.profiles.full_name ?? "Anônimo"}
              </span>
              <span>·</span>
              <span>{timeAgo(post.created_at)}</span>
            </div>
            {post.pinned && (
              <Pin className="size-3.5 text-amber-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <h3 className="font-heading text-sm font-semibold leading-snug">
            {post.title}
          </h3>
          {preview && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {preview}
            </p>
          )}
        </CardContent>
        <CardFooter className="gap-3 text-xs text-muted-foreground">
          {post.categories && (
            <Badge
              variant="secondary"
              className="text-[10px]"
              style={
                {
                  "--badge-bg": post.categories.color,
                  backgroundColor: `color-mix(in oklch, ${post.categories.color} 15%, transparent)`,
                  color: post.categories.color,
                } as React.CSSProperties
              }
            >
              {post.categories.name}
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              ❤️ {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              {post.comments_count}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
