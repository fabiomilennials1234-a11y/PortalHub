import { describe, it, expect } from "vitest"
import type { UserRole, MembershipStatus, OrgSettings } from "@/types/domain"
import type { Profile, Organization, Membership } from "@/types/database.types"

describe("domain types", () => {
  it("UserRole accepts valid values", () => {
    const roles: UserRole[] = ["owner", "admin", "moderator", "member"]
    expect(roles).toHaveLength(4)
  })

  it("MembershipStatus accepts valid values", () => {
    const statuses: MembershipStatus[] = ["active", "banned", "pending"]
    expect(statuses).toHaveLength(3)
  })

  it("OrgSettings has required fields", () => {
    const settings: OrgSettings = {
      visibility: "public",
      join_mode: "open",
      gamification_enabled: true,
      points_config: {
        post_created: 10,
        comment_created: 5,
        lesson_completed: 20,
        reaction_given: 2,
        daily_login: 15,
      },
    }
    expect(settings.gamification_enabled).toBe(true)
    expect(settings.points_config.post_created).toBe(10)
  })

  it("Profile type matches schema", () => {
    const profile: Profile = {
      id: "uuid",
      full_name: "Test User",
      avatar_url: null,
      bio: "Hello",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(profile.id).toBe("uuid")
  })

  it("Organization type matches schema", () => {
    const org: Organization = {
      id: "uuid",
      name: "Test Org",
      slug: "test-org",
      description: null,
      logo_url: null,
      banner_url: null,
      theme_color: "#6366f1",
      owner_id: "user-uuid",
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(org.slug).toBe("test-org")
  })

  it("Membership type matches schema", () => {
    const membership: Membership = {
      id: "uuid",
      user_id: "user-uuid",
      org_id: "org-uuid",
      role: "member",
      status: "active",
      points: 0,
      level: 1,
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    expect(membership.role).toBe("member")
    expect(membership.points).toBe(0)
  })
})
