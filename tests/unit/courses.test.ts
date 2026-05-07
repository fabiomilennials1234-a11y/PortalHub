import { describe, it, expect } from "vitest"
import { z } from "zod"
import { slugify, formatDuration } from "@/lib/utils"
import { isAllowedVideoUrl, extractVideoEmbedUrl } from "@/lib/validators"

// ── Schemas (mirrored from courses.ts) ───────────────────────

const createCourseSchema = z.object({
  org_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
})

const updateCourseSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
})

const createModuleSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
})

const createLessonSchema = z.object({
  module_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content_type: z.enum(["video", "text", "embed"]).default("video"),
  video_url: z.string().optional().or(z.literal("")),
  duration_seconds: z.coerce.number().int().min(0).default(0),
})

const enrollSchema = z.object({
  course_id: z.string().uuid(),
})

const lessonIdSchema = z.object({
  lesson_id: z.string().uuid(),
})

// ── Tests ────────────────────────────────────────────────────

const UUID = "550e8400-e29b-41d4-a716-446655440000"

describe("Course schemas", () => {
  it("validates createCourse with all fields", () => {
    const r = createCourseSchema.safeParse({
      org_id: UUID,
      title: "Intro to Marketing",
      slug: "intro-to-marketing",
      description: "Learn the basics",
    })
    expect(r.success).toBe(true)
  })

  it("validates createCourse without optional fields", () => {
    const r = createCourseSchema.safeParse({
      org_id: UUID,
      title: "Course",
    })
    expect(r.success).toBe(true)
  })

  it("rejects empty title", () => {
    const r = createCourseSchema.safeParse({ org_id: UUID, title: "" })
    expect(r.success).toBe(false)
  })

  it("rejects title over 200 chars", () => {
    const r = createCourseSchema.safeParse({
      org_id: UUID,
      title: "a".repeat(201),
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid slug characters", () => {
    const r = createCourseSchema.safeParse({
      org_id: UUID,
      title: "Test",
      slug: "Invalid Slug!",
    })
    expect(r.success).toBe(false)
  })

  it("validates updateCourse with status", () => {
    const r = updateCourseSchema.safeParse({
      course_id: UUID,
      status: "published",
    })
    expect(r.success).toBe(true)
  })

  it("rejects invalid status", () => {
    const r = updateCourseSchema.safeParse({
      course_id: UUID,
      status: "deleted",
    })
    expect(r.success).toBe(false)
  })
})

describe("Module schemas", () => {
  it("validates createModule", () => {
    const r = createModuleSchema.safeParse({
      course_id: UUID,
      title: "Module 1",
    })
    expect(r.success).toBe(true)
  })

  it("rejects empty module title", () => {
    const r = createModuleSchema.safeParse({ course_id: UUID, title: "" })
    expect(r.success).toBe(false)
  })
})

describe("Lesson schemas", () => {
  it("validates video lesson", () => {
    const r = createLessonSchema.safeParse({
      module_id: UUID,
      title: "Lesson 1",
      content_type: "video",
      video_url: "https://www.youtube.com/watch?v=abc123",
      duration_seconds: "600",
    })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.duration_seconds).toBe(600)
  })

  it("validates text lesson", () => {
    const r = createLessonSchema.safeParse({
      module_id: UUID,
      title: "Lesson 2",
      content_type: "text",
    })
    expect(r.success).toBe(true)
  })

  it("rejects invalid content_type", () => {
    const r = createLessonSchema.safeParse({
      module_id: UUID,
      title: "Lesson",
      content_type: "podcast",
    })
    expect(r.success).toBe(false)
  })
})

describe("Enrollment schemas", () => {
  it("validates enroll", () => {
    const r = enrollSchema.safeParse({ course_id: UUID })
    expect(r.success).toBe(true)
  })

  it("rejects invalid uuid", () => {
    const r = enrollSchema.safeParse({ course_id: "not-uuid" })
    expect(r.success).toBe(false)
  })
})

describe("Lesson progress schemas", () => {
  it("validates lessonId", () => {
    const r = lessonIdSchema.safeParse({ lesson_id: UUID })
    expect(r.success).toBe(true)
  })
})

describe("slugify", () => {
  it("converts title to slug", () => {
    expect(slugify("Intro to Marketing")).toBe("intro-to-marketing")
  })

  it("removes accents", () => {
    expect(slugify("Programação Avançada")).toBe("programacao-avancada")
  })

  it("handles special characters", () => {
    expect(slugify("Hello & World!")).toBe("hello-world")
  })

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--test--")).toBe("test")
  })

  it("limits to 100 chars", () => {
    const long = "a".repeat(200)
    expect(slugify(long).length).toBeLessThanOrEqual(100)
  })
})

describe("formatDuration", () => {
  it("formats minutes only", () => {
    expect(formatDuration(300)).toBe("5min")
  })

  it("formats hours and minutes", () => {
    expect(formatDuration(5400)).toBe("1h 30min")
  })

  it("formats zero", () => {
    expect(formatDuration(0)).toBe("0min")
  })
})

describe("Video URL validation", () => {
  it("allows youtube.com", () => {
    expect(isAllowedVideoUrl("https://www.youtube.com/watch?v=abc")).toBe(true)
  })

  it("allows youtu.be", () => {
    expect(isAllowedVideoUrl("https://youtu.be/abc123")).toBe(true)
  })

  it("allows vimeo.com", () => {
    expect(isAllowedVideoUrl("https://vimeo.com/123456")).toBe(true)
  })

  it("allows loom.com", () => {
    expect(isAllowedVideoUrl("https://www.loom.com/share/abc123")).toBe(true)
  })

  it("rejects random domain", () => {
    expect(isAllowedVideoUrl("https://evil.com/video")).toBe(false)
  })

  it("rejects invalid URL", () => {
    expect(isAllowedVideoUrl("not-a-url")).toBe(false)
  })
})

describe("Video embed URL extraction", () => {
  it("extracts YouTube embed URL", () => {
    expect(
      extractVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ")
  })

  it("extracts youtu.be embed URL", () => {
    expect(extractVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    )
  })

  it("extracts Vimeo embed URL", () => {
    expect(extractVideoEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789",
    )
  })

  it("extracts Loom embed URL", () => {
    expect(
      extractVideoEmbedUrl("https://www.loom.com/share/abc123def"),
    ).toBe("https://www.loom.com/embed/abc123def")
  })

  it("returns null for unsupported URL", () => {
    expect(extractVideoEmbedUrl("https://evil.com/video")).toBe(null)
  })
})
