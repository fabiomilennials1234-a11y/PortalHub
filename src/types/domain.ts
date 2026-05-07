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
