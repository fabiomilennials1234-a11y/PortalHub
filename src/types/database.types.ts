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
