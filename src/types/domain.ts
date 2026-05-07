export type UserRole = "owner" | "admin" | "moderator" | "member"
export type MembershipStatus = "active" | "banned" | "pending"
export type PostType = "discussion" | "question" | "announcement"
export type CourseStatus = "draft" | "published" | "archived"
export type LessonType = "video" | "text" | "quiz"
export type CourseAccessType = "free" | "paid" | "level_locked"
export type LessonContentType = "video" | "text" | "embed"
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

export interface CourseWithAuthor {
  id: string
  org_id: string
  author_id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  status: CourseStatus
  access_type: CourseAccessType
  required_level: number | null
  position: number
  total_lessons: number
  total_duration_seconds: number
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface ModuleWithLessons {
  id: string
  course_id: string
  title: string
  description: string | null
  position: number
  created_at: string
  lessons: LessonSummary[]
}

export interface LessonSummary {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: LessonContentType
  duration_seconds: number
  position: number
  is_free_preview: boolean
}

export interface LessonFull {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: LessonContentType
  video_url: string | null
  text_content: unknown
  duration_seconds: number
  position: number
  is_free_preview: boolean
  created_at: string
  updated_at: string
}

export interface LessonWithProgress extends LessonSummary {
  completed: boolean
}

export interface ModuleWithProgress extends Omit<ModuleWithLessons, "lessons"> {
  lessons: LessonWithProgress[]
  completed_count: number
  total_count: number
}

// ── Gamification ──

export type AchievementType = "milestone" | "streak" | "special"
export type PointAction =
  | "post_created"
  | "comment_created"
  | "lesson_completed"
  | "reaction_given"
  | "daily_login"
  | "achievement_earned"

export interface LeaderboardEntry {
  user_id: string
  org_id: string
  points: number
  level: number
  rank: number
  profile: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface AchievementWithEarned {
  id: string
  org_id: string
  name: string
  description: string | null
  type: AchievementType
  criteria: unknown
  badge_url: string | null
  icon: string | null
  color: string | null
  points_reward: number
  created_at: string
  earned: boolean
  earned_at: string | null
}

export interface ActivityEntry {
  id: string
  user_id: string
  org_id: string
  action: PointAction | string
  points: number
  reference_type: string | null
  reference_id: string | null
  created_at: string
  profile: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface UserStats {
  points: number
  level: number
  level_name: string
  next_level_points: number | null
  rank: number | null
  achievements_count: number
}
