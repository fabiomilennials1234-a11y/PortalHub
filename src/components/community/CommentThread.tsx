"use client"

import { useState } from "react"
import { GradientAvatar } from "@/components/shared/GradientAvatar"
import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { ReactionBar } from "@/components/community/ReactionBar"
import { CommentForm } from "@/components/community/CommentForm"
import { useComments } from "@/hooks/useComments"
import { Loader2, Lock } from "lucide-react"
import type { CommentWithAuthor } from "@/types/domain"

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
  // Heuristic TIER pra display — derivado do volume agregado.
  const tier = Math.max(
    1,
    Math.min(15, Math.floor((comment.likes_count ?? 0) / 3) + 1),
  )

  return (
    <div className="group">
      <div className="flex gap-3">
        <GradientAvatar
          userId={comment.author_id}
          name={comment.profiles.full_name}
          avatarUrl={comment.profiles.avatar_url}
          size={28}
          ringClassName="ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-serif text-[13.5px] font-medium text-foreground">
              {comment.profiles.full_name ?? "Anonimo"}
            </span>
            <span className="wf-mono">
              TIER {tier} · {timeAgo(comment.created_at)}
            </span>
          </div>

          <div className="mt-1.5">
            <RichTextRenderer
              content={comment.body}
              className="text-[13.5px] leading-[1.6]"
            />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <ReactionBar targetType="comment" targetId={comment.id} />
            {depth < 2 && (
              <button
                type="button"
                onClick={() => setReplying(!replying)}
                className="wf-mono text-gold-dk transition-colors hover:underline"
              >
                {replying ? "cancelar" : "responder"}
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-3">
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
        <div className="ml-[18px] mt-4 space-y-5 border-l border-line-soft pl-5">
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
  const count = comments?.length ?? 0

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="wf-mono">
          {count > 0 ? `${count} respostas` : "respostas"}
        </h2>
        {count > 0 && (
          <span className="wf-mono text-ink-low">ordenar por · recente</span>
        )}
      </header>

      {locked ? (
        <div className="wf-box flex items-center gap-3 p-4">
          <Lock className="h-4 w-4 text-ink-mid" />
          <p className="font-serif text-[13.5px] italic text-ink-soft">
            Este post esta trancado. Novos comentarios nao sao permitidos.
          </p>
        </div>
      ) : (
        <CommentForm postId={postId} />
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-ink-mid" />
        </div>
      )}

      <div className="space-y-7">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            depth={1}
          />
        ))}
      </div>

      {!isLoading && count === 0 && (
        <div className="border-l-2 border-gold py-3 pl-4">
          <p className="font-serif text-[14px] italic text-ink-soft">
            Nenhuma resposta ainda. Seja o primeiro — +8 creditos ao responder.
          </p>
        </div>
      )}
    </section>
  )
}
