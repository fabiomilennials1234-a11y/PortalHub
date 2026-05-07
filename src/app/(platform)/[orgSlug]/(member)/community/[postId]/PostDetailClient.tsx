"use client"

import { Separator } from "@/components/ui/separator"
import { ReactionBar } from "@/components/community/ReactionBar"
import { CommentThread } from "@/components/community/CommentThread"

interface PostDetailClientProps {
  postId: string
  locked: boolean
}

export function PostDetailClient({ postId, locked }: PostDetailClientProps) {
  return (
    <>
      <ReactionBar targetType="post" targetId={postId} />
      <Separator />
      <CommentThread postId={postId} locked={locked} />
    </>
  )
}
