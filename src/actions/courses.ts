"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { slugify } from "@/lib/utils"
import { isAllowedVideoUrl } from "@/lib/validators"

// ── Schemas ──────────────────────────────────────────────────

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
  position: z.coerce.number().int().min(0).optional(),
})

const courseIdSchema = z.object({
  course_id: z.string().uuid(),
})

const createModuleSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
})

const updateModuleSchema = z.object({
  module_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
})

const moduleIdSchema = z.object({
  module_id: z.string().uuid(),
})

const createLessonSchema = z.object({
  module_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  content_type: z.enum(["video", "text", "embed"]).default("video"),
  video_url: z.string().optional().or(z.literal("")),
  text_content: z.string().optional(),
  duration_seconds: z.coerce.number().int().min(0).default(0),
  is_free_preview: z
    .string()
    .optional()
    .transform((v) => v === "true"),
})

const updateLessonSchema = z.object({
  lesson_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  content_type: z.enum(["video", "text", "embed"]).optional(),
  video_url: z.string().optional().or(z.literal("")),
  text_content: z.string().optional(),
  duration_seconds: z.coerce.number().int().min(0).optional(),
  is_free_preview: z
    .string()
    .optional()
    .transform((v) => v === "true"),
})

const lessonIdSchema = z.object({
  lesson_id: z.string().uuid(),
})

const enrollSchema = z.object({
  course_id: z.string().uuid(),
})

// ── Course Actions ───────────────────────────────────────────

export async function createCourse(formData: FormData) {
  const parsed = createCourseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const courseSlug = parsed.data.slug || slugify(parsed.data.title)

  const { data, error } = await supabase
    .from("courses")
    .insert({
      org_id: parsed.data.org_id,
      author_id: user.id,
      title: parsed.data.title,
      slug: courseSlug,
      description: parsed.data.description || null,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updateCourse(formData: FormData) {
  const parsed = updateCourseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.title) updateData.title = parsed.data.title
  if (parsed.data.slug) updateData.slug = parsed.data.slug
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null
  if (parsed.data.status) updateData.status = parsed.data.status
  if (parsed.data.position !== undefined)
    updateData.position = parsed.data.position

  const { error } = await supabase
    .from("courses")
    .update(updateData)
    .eq("id", parsed.data.course_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteCourse(formData: FormData) {
  const parsed = courseIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", parsed.data.course_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function publishCourse(formData: FormData) {
  const parsed = courseIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()

  const { data: course } = await supabase
    .from("courses")
    .select("total_lessons")
    .eq("id", parsed.data.course_id)
    .single()

  if (!course) return { error: "Curso não encontrado" }
  if (course.total_lessons === 0) {
    return { error: "Curso precisa de pelo menos uma aula para ser publicado" }
  }

  const { error } = await supabase
    .from("courses")
    .update({ status: "published" })
    .eq("id", parsed.data.course_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function archiveCourse(formData: FormData) {
  const parsed = courseIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("courses")
    .update({ status: "archived" })
    .eq("id", parsed.data.course_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

// ── Module Actions ───────────────────────────────────────────

export async function createModule(formData: FormData) {
  const parsed = createModuleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()

  const { data: maxPos } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", parsed.data.course_id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextPosition = (maxPos?.position ?? -1) + 1

  const { data, error } = await supabase
    .from("modules")
    .insert({
      course_id: parsed.data.course_id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      position: nextPosition,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updateModule(formData: FormData) {
  const parsed = updateModuleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.title) updateData.title = parsed.data.title
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null

  const { error } = await supabase
    .from("modules")
    .update(updateData)
    .eq("id", parsed.data.module_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteModule(formData: FormData) {
  const parsed = moduleIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", parsed.data.module_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

// ── Lesson Actions ───────────────────────────────────────────

export async function createLesson(formData: FormData) {
  const parsed = createLessonSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  if (
    (parsed.data.content_type === "video" ||
      parsed.data.content_type === "embed") &&
    parsed.data.video_url &&
    !isAllowedVideoUrl(parsed.data.video_url)
  ) {
    return { error: "URL de vídeo não permitida. Use YouTube, Vimeo ou Loom." }
  }

  let textContentJson: unknown = null
  if (parsed.data.content_type === "text" && parsed.data.text_content) {
    try {
      textContentJson = JSON.parse(parsed.data.text_content)
    } catch {
      return { error: "Conteúdo de texto inválido" }
    }
  }

  const supabase = await createClient()

  const { data: maxPos } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", parsed.data.module_id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextPosition = (maxPos?.position ?? -1) + 1

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: parsed.data.module_id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      content_type: parsed.data.content_type,
      video_url: parsed.data.video_url || null,
      text_content: textContentJson,
      duration_seconds: parsed.data.duration_seconds,
      position: nextPosition,
      is_free_preview: parsed.data.is_free_preview,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updateLesson(formData: FormData) {
  const parsed = updateLessonSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  if (parsed.data.video_url && !isAllowedVideoUrl(parsed.data.video_url)) {
    return { error: "URL de vídeo não permitida. Use YouTube, Vimeo ou Loom." }
  }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}

  if (parsed.data.title) updateData.title = parsed.data.title
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null
  if (parsed.data.content_type) updateData.content_type = parsed.data.content_type
  if (parsed.data.video_url !== undefined)
    updateData.video_url = parsed.data.video_url || null
  if (parsed.data.text_content) {
    try {
      updateData.text_content = JSON.parse(parsed.data.text_content)
    } catch {
      return { error: "Conteúdo de texto inválido" }
    }
  }
  if (parsed.data.duration_seconds !== undefined)
    updateData.duration_seconds = parsed.data.duration_seconds
  if (parsed.data.is_free_preview !== undefined)
    updateData.is_free_preview = parsed.data.is_free_preview

  const { error } = await supabase
    .from("lessons")
    .update(updateData)
    .eq("id", parsed.data.lesson_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteLesson(formData: FormData) {
  const parsed = lessonIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", parsed.data.lesson_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

// ── Enrollment Actions ───────────────────────────────────────

export async function enrollInCourse(formData: FormData) {
  const parsed = enrollSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data, error } = await supabase
    .from("enrollments")
    .upsert(
      { user_id: user.id, course_id: parsed.data.course_id },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    )
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function unenrollFromCourse(formData: FormData) {
  const parsed = enrollSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("user_id", user.id)
    .eq("course_id", parsed.data.course_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

// ── Lesson Progress Actions ──────────────────────────────────

export async function markLessonComplete(formData: FormData) {
  const parsed = lessonIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("lesson_completions")
    .upsert(
      { user_id: user.id, lesson_id: parsed.data.lesson_id },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
    )
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function markLessonIncomplete(formData: FormData) {
  const parsed = lessonIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error: delError } = await supabase
    .from("lesson_completions")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", parsed.data.lesson_id)
  if (delError) return { error: delError.message }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("module_id")
    .eq("id", parsed.data.lesson_id)
    .single()

  if (lesson) {
    const { data: mod } = await supabase
      .from("modules")
      .select("course_id")
      .eq("id", lesson.module_id)
      .single()

    if (mod) {
      await supabase
        .from("enrollments")
        .update({ completed_at: null })
        .eq("user_id", user.id)
        .eq("course_id", mod.course_id)
    }
  }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
