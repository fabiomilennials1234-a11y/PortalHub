export type UserRole = "owner" | "admin" | "moderator" | "member"
export type MembershipStatus = "active" | "banned" | "pending"
export type PostType = "discussion" | "question" | "announcement"
export type CourseStatus = "draft" | "published" | "archived"
export type LessonType = "video" | "text" | "quiz"
export type EventStatus = "upcoming" | "live" | "ended" | "cancelled"
export type SubscriptionTier = "free" | "paid"
export type NotificationType =
  | "post_reply"
  | "comment_reply"
  | "mention"
  | "achievement"
  | "event_reminder"
  | "course_update"

export type OrgVisibility = "public" | "private"
export type JoinMode = "open" | "invite" | "approval"

export interface OrgSettings {
  visibility: OrgVisibility
  join_mode: JoinMode
  gamification_enabled: boolean
  points_config: {
    post_created: number
    comment_created: number
    lesson_completed: number
    reaction_given: number
    daily_login: number
  }
}

export type ReactionType = "like" | "love" | "insightful" | "fire"

export interface PostWithAuthor {
  id: string
  org_id: string
  author_id: string
  category_id: string | null
  title: string
  body: unknown
  pinned: boolean
  locked: boolean
  published: boolean
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
  categories: {
    name: string
    slug: string
    color: string
  } | null
}

export interface CommentWithAuthor {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  body: unknown
  likes_count: number
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
  children?: CommentWithAuthor[]
}

export interface MemberWithProfile {
  id: string
  user_id: string
  org_id: string
  role: UserRole
  status: MembershipStatus
  points: number
  level: number
  joined_at: string
  profile: {
    full_name: string | null
    avatar_url: string | null
    bio: string | null
  }
}
