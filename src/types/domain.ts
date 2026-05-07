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

// ── Payments ──

export type PlanInterval = "month" | "year"
export type SubscriptionStatus =
  | "incomplete"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "trialing"
export type PaymentStatus = "succeeded" | "failed" | "pending" | "refunded"

export interface PlanFeature {
  label: string
  included: boolean
}

export interface PlanWithFeatures {
  id: string
  org_id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  interval: PlanInterval
  stripe_price_id: string | null
  features: PlanFeature[]
  active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface SubscriptionWithPlan {
  id: string
  user_id: string
  org_id: string
  plan_id: string | null
  status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  trial_end: string | null
  plan: {
    name: string
    price_cents: number
    currency: string
    interval: PlanInterval
  } | null
}

// ── Events ──

export interface EventWithHost {
  id: string
  org_id: string
  host_id: string
  title: string
  description: string | null
  cover_url: string | null
  status: EventStatus
  starts_at: string
  ends_at: string
  location_url: string | null
  location_label: string | null
  max_attendees: number | null
  attendees_count: number
  host: {
    full_name: string | null
    avatar_url: string | null
  }
}

// ── Reports ──

export type ReportTargetType = "post" | "comment" | "user"
export type ReportReason =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "inappropriate"
  | "misinformation"
  | "other"
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed"

export interface ReportWithReporter {
  id: string
  org_id: string
  reporter_id: string
  target_type: ReportTargetType
  target_id: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  resolved_by: string | null
  resolution_note: string | null
  created_at: string
  resolved_at: string | null
  reporter: {
    full_name: string | null
    avatar_url: string | null
  }
}

// ── Notifications ──

export interface NotificationWithActor {
  id: string
  user_id: string
  org_id: string | null
  actor_id: string | null
  type: string
  title: string
  body: string | null
  action_url: string | null
  reference_type: string | null
  reference_id: string | null
  read: boolean
  read_at: string | null
  created_at: string
  actor: {
    full_name: string | null
    avatar_url: string | null
  } | null
}
