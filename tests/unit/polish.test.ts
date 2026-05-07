import { describe, it, expect } from "vitest"
import { z } from "zod"
import { slugify, formatDuration, cn } from "@/lib/utils"

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
})

describe("Profile schema", () => {
  it("validates full update", () => {
    const r = updateProfileSchema.safeParse({
      full_name: "Fabio",
      bio: "Founder de PortalHub",
      avatar_url: "https://example.com/avatar.jpg",
    })
    expect(r.success).toBe(true)
  })

  it("validates partial — only name", () => {
    const r = updateProfileSchema.safeParse({ full_name: "X" })
    expect(r.success).toBe(true)
  })

  it("rejects empty name when provided", () => {
    const r = updateProfileSchema.safeParse({ full_name: "" })
    expect(r.success).toBe(false)
  })

  it("rejects bio over 500", () => {
    const r = updateProfileSchema.safeParse({ bio: "a".repeat(501) })
    expect(r.success).toBe(false)
  })

  it("accepts empty avatar_url string", () => {
    const r = updateProfileSchema.safeParse({ avatar_url: "" })
    expect(r.success).toBe(true)
  })

  it("rejects invalid avatar_url", () => {
    const r = updateProfileSchema.safeParse({ avatar_url: "not-url" })
    expect(r.success).toBe(false)
  })
})

describe("cn utility", () => {
  it("merges class strings", () => {
    expect(cn("a", "b")).toContain("a")
    expect(cn("a", "b")).toContain("b")
  })

  it("skips falsy values", () => {
    const r = cn("a", false && "b", null, "c")
    expect(r).toContain("a")
    expect(r).toContain("c")
    expect(r).not.toContain("b")
  })

  it("dedupes tailwind classes", () => {
    const r = cn("p-2", "p-4")
    expect(r).toBe("p-4")
  })
})

describe("slugify edge cases", () => {
  it("handles unicode", () => {
    const r = slugify("São Paulo · Café")
    expect(r).toMatch(/^[a-z0-9-]+$/)
  })

  it("returns empty string for only special chars", () => {
    expect(slugify("@#$%^&*()")).toBe("")
  })

  it("collapses multiple spaces", () => {
    expect(slugify("a    b    c")).toBe("a-b-c")
  })
})

describe("formatDuration variants", () => {
  it("0 seconds", () => {
    expect(formatDuration(0)).toBe("0min")
  })

  it("59 seconds rounds down to 0min", () => {
    expect(formatDuration(59)).toBe("0min")
  })

  it("1 hour exact", () => {
    expect(formatDuration(3600)).toBe("1h 0min")
  })

  it("multiple hours", () => {
    expect(formatDuration(7800)).toBe("2h 10min")
  })
})
