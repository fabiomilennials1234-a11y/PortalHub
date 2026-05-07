export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          theme_color: string
          owner_id: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          theme_color?: string
          owner_id: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          theme_color?: string
          settings?: Json
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          org_id: string
          role: "owner" | "admin" | "moderator" | "member"
          status: "active" | "banned" | "pending"
          points: number
          level: number
          joined_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          role?: "owner" | "admin" | "moderator" | "member"
          status?: "active" | "banned" | "pending"
          points?: number
          level?: number
          joined_at?: string
          updated_at?: string
        }
        Update: {
          role?: "owner" | "admin" | "moderator" | "member"
          status?: "active" | "banned" | "pending"
          points?: number
          level?: number
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          org_id: string
          name: string
          slug: string
          color: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          slug: string
          color?: string
          position?: number
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          color?: string
          position?: number
        }
      }
      posts: {
        Row: {
          id: string
          org_id: string
          author_id: string
          category_id: string | null
          title: string
          body: Json
          pinned: boolean
          locked: boolean
          published: boolean
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          author_id: string
          category_id?: string | null
          title: string
          body: Json
          pinned?: boolean
          locked?: boolean
          published?: boolean
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          title?: string
          body?: Json
          pinned?: boolean
          locked?: boolean
          published?: boolean
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          parent_id: string | null
          body: Json
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          parent_id?: string | null
          body: Json
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          body?: Json
          updated_at?: string
        }
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          target_type: "post" | "comment"
          target_id: string
          reaction_type: "like" | "love" | "insightful" | "fire"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: "post" | "comment"
          target_id: string
          reaction_type: "like" | "love" | "insightful" | "fire"
          created_at?: string
        }
        Update: {
          reaction_type?: "like" | "love" | "insightful" | "fire"
        }
      }
      courses: {
        Row: {
          id: string
          org_id: string
          author_id: string
          title: string
          slug: string
          description: string | null
          thumbnail_url: string | null
          status: "draft" | "published" | "archived"
          access_type: "free" | "paid" | "level_locked"
          required_level: number | null
          position: number
          total_lessons: number
          total_duration_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          author_id: string
          title: string
          slug: string
          description?: string | null
          thumbnail_url?: string | null
          status?: "draft" | "published" | "archived"
          access_type?: "free" | "paid" | "level_locked"
          required_level?: number | null
          position?: number
          total_lessons?: number
          total_duration_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          thumbnail_url?: string | null
          status?: "draft" | "published" | "archived"
          access_type?: "free" | "paid" | "level_locked"
          required_level?: number | null
          position?: number
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          position?: number
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          content_type: "video" | "text" | "embed"
          video_url: string | null
          text_content: Json | null
          duration_seconds: number
          position: number
          is_free_preview: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          content_type?: "video" | "text" | "embed"
          video_url?: string | null
          text_content?: Json | null
          duration_seconds?: number
          position?: number
          is_free_preview?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          content_type?: "video" | "text" | "embed"
          video_url?: string | null
          text_content?: Json | null
          duration_seconds?: number
          position?: number
          is_free_preview?: boolean
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          completed_at?: string | null
        }
      }
      lesson_completions: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string
        }
        Update: Record<string, never>
      }
      point_events: {
        Row: {
          id: string
          user_id: string
          org_id: string
          action: string
          points: number
          reference_type: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          action: string
          points: number
          reference_type?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      levels: {
        Row: {
          id: string
          org_id: string
          level_number: number
          name: string
          min_points: number
          icon: string | null
          color: string | null
          perks: Json
        }
        Insert: {
          id?: string
          org_id: string
          level_number: number
          name: string
          min_points: number
          icon?: string | null
          color?: string | null
          perks?: Json
        }
        Update: {
          name?: string
          min_points?: number
          icon?: string | null
          color?: string | null
          perks?: Json
        }
      }
      achievements: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          type: "milestone" | "streak" | "special"
          criteria: Json
          badge_url: string | null
          icon: string | null
          color: string | null
          points_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          type: "milestone" | "streak" | "special"
          criteria: Json
          badge_url?: string | null
          icon?: string | null
          color?: string | null
          points_reward?: number
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          type?: "milestone" | "streak" | "special"
          criteria?: Json
          badge_url?: string | null
          icon?: string | null
          color?: string | null
          points_reward?: number
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: Record<string, never>
      }
      plans: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          price_cents: number
          currency: string
          interval: "month" | "year"
          stripe_product_id: string | null
          stripe_price_id: string | null
          features: Json
          active: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          price_cents: number
          currency?: string
          interval?: "month" | "year"
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          features?: Json
          active?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          price_cents?: number
          currency?: string
          interval?: "month" | "year"
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          features?: Json
          active?: boolean
          position?: number
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          org_id: string
          plan_id: string | null
          status:
            | "incomplete"
            | "active"
            | "past_due"
            | "canceled"
            | "unpaid"
            | "trialing"
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          plan_id?: string | null
          status?:
            | "incomplete"
            | "active"
            | "past_due"
            | "canceled"
            | "unpaid"
            | "trialing"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          plan_id?: string | null
          status?:
            | "incomplete"
            | "active"
            | "past_due"
            | "canceled"
            | "unpaid"
            | "trialing"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_end?: string | null
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          org_id: string
          subscription_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          amount_cents: number
          currency: string
          status: "succeeded" | "failed" | "pending" | "refunded"
          invoice_url: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          subscription_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          amount_cents: number
          currency?: string
          status: "succeeded" | "failed" | "pending" | "refunded"
          invoice_url?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type Membership = Database["public"]["Tables"]["memberships"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Post = Database["public"]["Tables"]["posts"]["Row"]
export type Comment = Database["public"]["Tables"]["comments"]["Row"]
export type Reaction = Database["public"]["Tables"]["reactions"]["Row"]
export type Course = Database["public"]["Tables"]["courses"]["Row"]
export type Module = Database["public"]["Tables"]["modules"]["Row"]
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"]
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"]
export type LessonCompletion = Database["public"]["Tables"]["lesson_completions"]["Row"]
export type PointEvent = Database["public"]["Tables"]["point_events"]["Row"]
export type Level = Database["public"]["Tables"]["levels"]["Row"]
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"]
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"]
export type Plan = Database["public"]["Tables"]["plans"]["Row"]
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type Payment = Database["public"]["Tables"]["payments"]["Row"]
