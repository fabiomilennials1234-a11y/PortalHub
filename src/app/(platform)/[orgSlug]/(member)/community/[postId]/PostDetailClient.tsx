"use client"

import { ReactionBar } from "@/components/community/ReactionBar"
import { CommentThread } from "@/components/community/CommentThread"

interface PostDetailClientProps {
  postId: string
  locked: boolean
}

export function PostDetailClient({ postId, locked }: PostDetailClientProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <ReactionBar targetType="post" targetId={postId} />
        <span className="wf-mono ml-auto">
          +8 creditos ao responder
        </span>
      </div>

      <div className="h-px bg-line-soft" />

      <CommentThread postId={postId} locked={locked} />
    </>
  )
}
