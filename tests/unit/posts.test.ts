import { describe, it, expect } from "vitest"
import { z } from "zod"

const createPostSchema = z.object({
  org_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  category_id: z.string().uuid().optional().or(z.literal("")),
})

const updatePostSchema = z.object({
  post_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  body: z.string().optional(),
})

const postIdSchema = z.object({
  post_id: z.string().uuid(),
})

const createCommentSchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().min(1),
  parent_id: z.string().uuid().optional().or(z.literal("")),
})

describe("Post schemas", () => {
  const validUUID = "550e8400-e29b-41d4-a716-446655440000"

  it("validates createPost with all fields", () => {
    const result = createPostSchema.safeParse({
      org_id: validUUID,
      title: "Test Post",
      body: '{"type":"doc","content":[]}',
      category_id: validUUID,
    })
    expect(result.success).toBe(true)
  })

  it("validates createPost without category", () => {
    const result = createPostSchema.safeParse({
      org_id: validUUID,
      title: "Test Post",
      body: '{"type":"doc","content":[]}',
      category_id: "",
    })
    expect(result.success).toBe(true)
  })

  it("rejects createPost with empty title", () => {
    const result = createPostSchema.safeParse({
      org_id: validUUID,
      title: "",
      body: '{"type":"doc"}',
    })
    expect(result.success).toBe(false)
  })

  it("rejects title exceeding 200 chars", () => {
    const result = createPostSchema.safeParse({
      org_id: validUUID,
      title: "a".repeat(201),
      body: "content",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid org_id", () => {
    const result = createPostSchema.safeParse({
      org_id: "not-a-uuid",
      title: "Test",
      body: "content",
    })
    expect(result.success).toBe(false)
  })

  it("validates updatePost with title only", () => {
    const result = updatePostSchema.safeParse({
      post_id: validUUID,
      title: "Updated Title",
    })
    expect(result.success).toBe(true)
  })

  it("validates postIdSchema", () => {
    const result = postIdSchema.safeParse({ post_id: validUUID })
    expect(result.success).toBe(true)
  })

  it("rejects postIdSchema with invalid uuid", () => {
    const result = postIdSchema.safeParse({ post_id: "abc" })
    expect(result.success).toBe(false)
  })
})

describe("Comment schemas", () => {
  const validUUID = "550e8400-e29b-41d4-a716-446655440000"

  it("validates comment with parent_id", () => {
    const result = createCommentSchema.safeParse({
      post_id: validUUID,
      body: '{"type":"doc","content":[]}',
      parent_id: validUUID,
    })
    expect(result.success).toBe(true)
  })

  it("validates comment without parent_id", () => {
    const result = createCommentSchema.safeParse({
      post_id: validUUID,
      body: '{"type":"doc","content":[]}',
      parent_id: "",
    })
    expect(result.success).toBe(true)
  })

  it("rejects comment with empty body", () => {
    const result = createCommentSchema.safeParse({
      post_id: validUUID,
      body: "",
    })
    expect(result.success).toBe(false)
  })
})
