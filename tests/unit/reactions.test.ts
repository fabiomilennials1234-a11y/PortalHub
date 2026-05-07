import { describe, it, expect } from "vitest"
import { z } from "zod"

const toggleReactionSchema = z.object({
  target_type: z.enum(["post", "comment"]),
  target_id: z.string().uuid(),
  reaction_type: z.enum(["like", "love", "insightful", "fire"]),
})

const VALID_REACTIONS = ["like", "love", "insightful", "fire"] as const

describe("Reaction schema", () => {
  const validUUID = "550e8400-e29b-41d4-a716-446655440000"

  it.each(VALID_REACTIONS)("accepts reaction type: %s", (type) => {
    const result = toggleReactionSchema.safeParse({
      target_type: "post",
      target_id: validUUID,
      reaction_type: type,
    })
    expect(result.success).toBe(true)
  })

  it("accepts comment target type", () => {
    const result = toggleReactionSchema.safeParse({
      target_type: "comment",
      target_id: validUUID,
      reaction_type: "like",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid reaction type", () => {
    const result = toggleReactionSchema.safeParse({
      target_type: "post",
      target_id: validUUID,
      reaction_type: "haha",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid target type", () => {
    const result = toggleReactionSchema.safeParse({
      target_type: "story",
      target_id: validUUID,
      reaction_type: "like",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid uuid for target_id", () => {
    const result = toggleReactionSchema.safeParse({
      target_type: "post",
      target_id: "not-uuid",
      reaction_type: "like",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing fields", () => {
    const result = toggleReactionSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
