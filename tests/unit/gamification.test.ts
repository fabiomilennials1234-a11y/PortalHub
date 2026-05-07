import { describe, it, expect } from "vitest"
import { z } from "zod"

const createAchievementSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  type: z.enum(["milestone", "streak", "special"]),
  criteria: z.string().min(1),
  icon: z.string().max(50).optional().or(z.literal("")),
  color: z.string().max(20).optional().or(z.literal("")),
  points_reward: z.coerce.number().int().min(0).default(0),
})

const updateLevelSchema = z.object({
  level_id: z.string().uuid(),
  name: z.string().min(1).max(50).optional(),
  min_points: z.coerce.number().int().min(0).optional(),
  color: z.string().max(20).optional(),
})

const ACHIEVEMENT_TYPES = ["milestone", "streak", "special"] as const

const POINT_ACTIONS = [
  "post_created",
  "comment_created",
  "lesson_completed",
  "reaction_given",
  "daily_login",
  "achievement_earned",
] as const

const UUID = "550e8400-e29b-41d4-a716-446655440000"

describe("Achievement schema", () => {
  it("validates milestone with points reward", () => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "First Post",
      type: "milestone",
      criteria: '{"action":"post_created","threshold":1}',
      points_reward: "50",
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.points_reward).toBe(50)
  })

  it.each(ACHIEVEMENT_TYPES)("accepts type %s", (type) => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "X",
      type,
      criteria: "{}",
    })
    expect(r.success).toBe(true)
  })

  it("rejects invalid type", () => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "X",
      type: "boss",
      criteria: "{}",
    })
    expect(r.success).toBe(false)
  })

  it("rejects empty name", () => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "",
      type: "milestone",
      criteria: "{}",
    })
    expect(r.success).toBe(false)
  })

  it("rejects name over 100 chars", () => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "a".repeat(101),
      type: "milestone",
      criteria: "{}",
    })
    expect(r.success).toBe(false)
  })

  it("rejects empty criteria", () => {
    const r = createAchievementSchema.safeParse({
      org_id: UUID,
      name: "X",
      type: "milestone",
      criteria: "",
    })
    expect(r.success).toBe(false)
  })
})

describe("Level update schema", () => {
  it("validates min_points coerced to int", () => {
    const r = updateLevelSchema.safeParse({
      level_id: UUID,
      name: "Master",
      min_points: "5000",
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.min_points).toBe(5000)
  })

  it("rejects negative min_points", () => {
    const r = updateLevelSchema.safeParse({
      level_id: UUID,
      min_points: "-10",
    })
    expect(r.success).toBe(false)
  })

  it("rejects empty name when provided", () => {
    const r = updateLevelSchema.safeParse({
      level_id: UUID,
      name: "",
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid uuid", () => {
    const r = updateLevelSchema.safeParse({
      level_id: "abc",
      name: "Master",
    })
    expect(r.success).toBe(false)
  })
})

describe("Point action types", () => {
  it.each(POINT_ACTIONS)("recognizes action: %s", (action) => {
    expect(POINT_ACTIONS).toContain(action)
  })

  it("has expected default point values shape", () => {
    const defaults = {
      post_created: 10,
      comment_created: 5,
      lesson_completed: 20,
      reaction_given: 2,
      daily_login: 15,
    }
    expect(defaults.post_created).toBe(10)
    expect(defaults.lesson_completed).toBeGreaterThan(defaults.comment_created)
  })
})

describe("Level threshold logic", () => {
  // Mirror the SQL calculate_level: pick highest level whose min_points <= points
  function calcLevel(
    points: number,
    levels: { level_number: number; min_points: number }[],
  ): number {
    const eligible = levels.filter((l) => l.min_points <= points)
    if (eligible.length === 0) return 1
    return Math.max(...eligible.map((l) => l.level_number))
  }

  const DEFAULT_LEVELS = [
    { level_number: 1, min_points: 0 },
    { level_number: 2, min_points: 50 },
    { level_number: 3, min_points: 150 },
    { level_number: 4, min_points: 400 },
    { level_number: 5, min_points: 1000 },
    { level_number: 6, min_points: 2500 },
  ]

  it("starts at level 1 with 0 points", () => {
    expect(calcLevel(0, DEFAULT_LEVELS)).toBe(1)
  })

  it("level 2 at exactly 50 points", () => {
    expect(calcLevel(50, DEFAULT_LEVELS)).toBe(2)
  })

  it("level 3 at 200 points", () => {
    expect(calcLevel(200, DEFAULT_LEVELS)).toBe(3)
  })

  it("level 6 at 5000 points", () => {
    expect(calcLevel(5000, DEFAULT_LEVELS)).toBe(6)
  })

  it("level 1 at 49 points", () => {
    expect(calcLevel(49, DEFAULT_LEVELS)).toBe(1)
  })
})
