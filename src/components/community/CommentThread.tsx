"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { ReactionBar } from "@/components/community/ReactionBar"
import { CommentForm } from "@/components/community/CommentForm"
import { useComments } from "@/hooks/useComments"
import { MessageSquare, Loader2 } from "lucide-react"
import type { CommentWithAuthor } from "@/types/domain"

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
  return `${days}d`
}

interface CommentItemProps {
  comment: CommentWithAuthor
  postId: string
  depth: number
}

function CommentItem({ comment, postId, depth }: CommentItemProps) {
  const [replying, setReplying] = useState(false)

  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar size="sm">
          {comment.profiles.avatar_url && (
            <AvatarImage src={comment.profiles.avatar_url} />
          )}
          <AvatarFallback>
            {getInitials(comment.profiles.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-foreground">
              {comment.profiles.full_name ?? "Anônimo"}
            </span>
            <span className="text-muted-foreground">
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <RichTextRenderer content={comment.body} className="text-sm" />
          <div className="flex items-center gap-2">
            <ReactionBar targetType="comment" targetId={comment.id} />
            {depth < 2 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setReplying(!replying)}
                className="text-xs text-muted-foreground"
              >
                <MessageSquare className="size-3" />
                Responder
              </Button>
            )}
          </div>
          {replying && (
            <div className="mt-2">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCancel={() => setReplying(false)}
                onSuccess={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
      {comment.children && comment.children.length > 0 && (
        <div className="ml-8 mt-3 space-y-3 border-l border-border pl-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentThreadProps {
  postId: string
  locked?: boolean
}

export function CommentThread({ postId, locked }: CommentThreadProps) {
  const { data: comments, isLoading } = useComments(postId)

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-sm font-semibold">Comentários</h3>
      {!locked && <CommentForm postId={postId} />}
      {locked && (
        <p className="text-xs text-muted-foreground">
          Este post está trancado. Novos comentários não são permitidos.
        </p>
      )}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            depth={1}
          />
        ))}
      </div>
      {!isLoading && comments?.length === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          Nenhum comentário ainda. Seja o primeiro!
        </p>
      )}
    </div>
  )
}
