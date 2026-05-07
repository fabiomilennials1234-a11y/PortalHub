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
      events: {
        Row: {
          id: string
          org_id: string
          host_id: string
          title: string
          description: string | null
          cover_url: string | null
          status: "upcoming" | "live" | "ended" | "cancelled"
          starts_at: string
          ends_at: string
          location_url: string | null
          location_label: string | null
          max_attendees: number | null
          attendees_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          host_id: string
          title: string
          description?: string | null
          cover_url?: string | null
          status?: "upcoming" | "live" | "ended" | "cancelled"
          starts_at: string
          ends_at: string
          location_url?: string | null
          location_label?: string | null
          max_attendees?: number | null
          attendees_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          cover_url?: string | null
          status?: "upcoming" | "live" | "ended" | "cancelled"
          starts_at?: string
          ends_at?: string
          location_url?: string | null
          location_label?: string | null
          max_attendees?: number | null
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string
          attended: boolean
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string
          attended?: boolean
        }
        Update: {
          attended?: boolean
        }
      }
      notifications: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          org_id?: string | null
          actor_id?: string | null
          type: string
          title: string
          body?: string | null
          action_url?: string | null
          reference_type?: string | null
          reference_id?: string | null
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          read?: boolean
          read_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          org_id: string
          reporter_id: string
          target_type: "post" | "comment" | "user"
          target_id: string
          reason:
            | "spam"
            | "harassment"
            | "hate_speech"
            | "inappropriate"
            | "misinformation"
            | "other"
          description: string | null
          status: "pending" | "reviewing" | "resolved" | "dismissed"
          resolved_by: string | null
          resolution_note: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          reporter_id: string
          target_type: "post" | "comment" | "user"
          target_id: string
          reason:
            | "spam"
            | "harassment"
            | "hate_speech"
            | "inappropriate"
            | "misinformation"
            | "other"
          description?: string | null
          status?: "pending" | "reviewing" | "resolved" | "dismissed"
          resolved_by?: string | null
          resolution_note?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          status?: "pending" | "reviewing" | "resolved" | "dismissed"
          resolved_by?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
        }
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
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type EventRegistration = Database["public"]["Tables"]["event_registrations"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type Report = Database["public"]["Tables"]["reports"]["Row"]
