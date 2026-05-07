"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
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

export async function createPost(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = createPostSchema.safeParse(raw)
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  let bodyJson: unknown
  try {
    bodyJson = JSON.parse(parsed.data.body)
  } catch {
    return { error: "Conteúdo inválido" }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      org_id: parsed.data.org_id,
      author_id: user.id,
      title: parsed.data.title,
      body: bodyJson,
      category_id: parsed.data.category_id || null,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updatePost(formData: FormData) {
  const parsed = updatePostSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.title) updateData.title = parsed.data.title
  if (parsed.data.body) {
    try {
      updateData.body = JSON.parse(parsed.data.body)
    } catch {
      return { error: "Conteúdo inválido" }
    }
  }

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", parsed.data.post_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deletePost(formData: FormData) {
  const parsed = postIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", parsed.data.post_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function togglePin(formData: FormData) {
  const parsed = postIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("pinned")
    .eq("id", parsed.data.post_id)
    .single()
  if (!post) return { error: "Post não encontrado" }

  const { error } = await supabase
    .from("posts")
    .update({ pinned: !post.pinned })
    .eq("id", parsed.data.post_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { pinned: !post.pinned } }
}

export async function toggleLock(formData: FormData) {
  const parsed = postIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("locked")
    .eq("id", parsed.data.post_id)
    .single()
  if (!post) return { error: "Post não encontrado" }

  const { error } = await supabase
    .from("posts")
    .update({ locked: !post.locked })
    .eq("id", parsed.data.post_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { locked: !post.locked } }
}
