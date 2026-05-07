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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type Membership = Database["public"]["Tables"]["memberships"]["Row"]
