"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createCommentSchema = z.object({
  post_id: z.string().uuid(),
  body: z.string().min(1),
  parent_id: z.string().uuid().optional().or(z.literal("")),
})

const deleteCommentSchema = z.object({
  comment_id: z.string().uuid(),
})

export async function createComment(formData: FormData) {
  const parsed = createCommentSchema.safeParse(Object.fromEntries(formData))
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

  // Enforce max nesting depth of 2 (top-level + 1 reply level)
  if (parsed.data.parent_id) {
    const { data: parent } = await supabase
      .from("comments")
      .select("parent_id")
      .eq("id", parsed.data.parent_id)
      .single()

    if (parent?.parent_id) {
      return { error: "Comentários permitem no máximo 2 níveis de aninhamento" }
    }
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: parsed.data.post_id,
      author_id: user.id,
      body: bodyJson,
      parent_id: parsed.data.parent_id || null,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function deleteComment(formData: FormData) {
  const parsed = deleteCommentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", parsed.data.comment_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
