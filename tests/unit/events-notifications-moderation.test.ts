import { describe, it, expect } from "vitest"
import { z } from "zod"

const createEventSchema = z.object({
  org_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  cover_url: z.string().url().optional().or(z.literal("")),
  starts_at: z.string().min(1),
  ends_at: z.string().min(1),
  location_url: z.string().url().optional().or(z.literal("")),
  location_label: z.string().max(200).optional().or(z.literal("")),
  max_attendees: z.coerce.number().int().min(1).optional(),
})

const eventIdSchema = z.object({
  event_id: z.string().uuid(),
})

const notificationIdSchema = z.object({
  notification_id: z.string().uuid(),
})

const createReportSchema = z.object({
  org_id: z.string().uuid(),
  target_type: z.enum(["post", "comment", "user"]),
  target_id: z.string().uuid(),
  reason: z.enum([
    "spam",
    "harassment",
    "hate_speech",
    "inappropriate",
    "misinformation",
    "other",
  ]),
  description: z.string().max(1000).optional().or(z.literal("")),
})

const resolveReportSchema = z.object({
  report_id: z.string().uuid(),
  status: z.enum(["reviewing", "resolved", "dismissed"]),
  resolution_note: z.string().max(1000).optional().or(z.literal("")),
})

const EVENT_STATUSES = ["upcoming", "live", "ended", "cancelled"] as const
const REPORT_REASONS = [
  "spam",
  "harassment",
  "hate_speech",
  "inappropriate",
  "misinformation",
  "other",
] as const
const REPORT_TARGET_TYPES = ["post", "comment", "user"] as const
const NOTIFICATION_TYPES = [
  "post_reply",
  "comment_reply",
  "mention",
  "achievement",
  "event_reminder",
  "event_starting",
  "course_update",
  "level_up",
  "reaction_received",
] as const

const UUID = "550e8400-e29b-41d4-a716-446655440000"

describe("Event schema", () => {
  it("validates create event", () => {
    const r = createEventSchema.safeParse({
      org_id: UUID,
      title: "Workshop",
      starts_at: "2026-06-01T10:00:00Z",
      ends_at: "2026-06-01T12:00:00Z",
      max_attendees: "30",
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.max_attendees).toBe(30)
  })

  it("rejects empty title", () => {
    const r = createEventSchema.safeParse({
      org_id: UUID,
      title: "",
      starts_at: "2026-06-01T10:00:00Z",
      ends_at: "2026-06-01T12:00:00Z",
    })
    expect(r.success).toBe(false)
  })

  it("rejects max_attendees < 1", () => {
    const r = createEventSchema.safeParse({
      org_id: UUID,
      title: "X",
      starts_at: "2026-06-01T10:00:00Z",
      ends_at: "2026-06-01T12:00:00Z",
      max_attendees: "0",
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid cover_url", () => {
    const r = createEventSchema.safeParse({
      org_id: UUID,
      title: "X",
      starts_at: "x",
      ends_at: "y",
      cover_url: "not-a-url",
    })
    expect(r.success).toBe(false)
  })

  it("validates eventId schema", () => {
    expect(eventIdSchema.safeParse({ event_id: UUID }).success).toBe(true)
    expect(eventIdSchema.safeParse({ event_id: "abc" }).success).toBe(false)
  })

  it.each(EVENT_STATUSES)("recognizes status: %s", (s) => {
    expect(EVENT_STATUSES).toContain(s)
  })
})

describe("Notification schema", () => {
  it("validates uuid", () => {
    const r = notificationIdSchema.safeParse({ notification_id: UUID })
    expect(r.success).toBe(true)
  })

  it("rejects invalid uuid", () => {
    const r = notificationIdSchema.safeParse({ notification_id: "x" })
    expect(r.success).toBe(false)
  })

  it.each(NOTIFICATION_TYPES)("recognizes type: %s", (t) => {
    expect(NOTIFICATION_TYPES).toContain(t)
  })
})

describe("Report schemas", () => {
  it("validates submit report", () => {
    const r = createReportSchema.safeParse({
      org_id: UUID,
      target_type: "post",
      target_id: UUID,
      reason: "spam",
    })
    expect(r.success).toBe(true)
  })

  it("validates with description", () => {
    const r = createReportSchema.safeParse({
      org_id: UUID,
      target_type: "comment",
      target_id: UUID,
      reason: "harassment",
      description: "Detalhes",
    })
    expect(r.success).toBe(true)
  })

  it("rejects invalid reason", () => {
    const r = createReportSchema.safeParse({
      org_id: UUID,
      target_type: "post",
      target_id: UUID,
      reason: "boring",
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid target_type", () => {
    const r = createReportSchema.safeParse({
      org_id: UUID,
      target_type: "lesson",
      target_id: UUID,
      reason: "spam",
    })
    expect(r.success).toBe(false)
  })

  it("rejects description over 1000 chars", () => {
    const r = createReportSchema.safeParse({
      org_id: UUID,
      target_type: "post",
      target_id: UUID,
      reason: "spam",
      description: "a".repeat(1001),
    })
    expect(r.success).toBe(false)
  })

  it("validates resolve report — resolved", () => {
    const r = resolveReportSchema.safeParse({
      report_id: UUID,
      status: "resolved",
    })
    expect(r.success).toBe(true)
  })

  it("rejects pending status in resolve schema", () => {
    const r = resolveReportSchema.safeParse({
      report_id: UUID,
      status: "pending",
    })
    expect(r.success).toBe(false)
  })

  it.each(REPORT_REASONS)("recognizes reason: %s", (reason) => {
    expect(REPORT_REASONS).toContain(reason)
  })

  it.each(REPORT_TARGET_TYPES)("recognizes target type: %s", (t) => {
    expect(REPORT_TARGET_TYPES).toContain(t)
  })
})
