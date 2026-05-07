"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const toggleReactionSchema = z.object({
  target_type: z.enum(["post", "comment"]),
  target_id: z.string().uuid(),
  reaction_type: z.enum(["like", "love", "insightful", "fire"]),
})

export async function toggleReaction(formData: FormData) {
  const parsed = toggleReactionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: existing } = await supabase
    .from("reactions")
    .select("id, reaction_type")
    .eq("user_id", user.id)
    .eq("target_type", parsed.data.target_type)
    .eq("target_id", parsed.data.target_id)
    .maybeSingle()

  if (existing) {
    if (existing.reaction_type === parsed.data.reaction_type) {
      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existing.id)
      if (error) return { error: error.message }
      revalidatePath("/", "layout")
      return { data: { action: "removed" as const } }
    }
    const { error } = await supabase
      .from("reactions")
      .update({ reaction_type: parsed.data.reaction_type })
      .eq("id", existing.id)
    if (error) return { error: error.message }
    revalidatePath("/", "layout")
    return { data: { action: "changed" as const } }
  }

  const { error } = await supabase.from("reactions").insert({
    user_id: user.id,
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    reaction_type: parsed.data.reaction_type,
  })
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { action: "added" as const } }
}
