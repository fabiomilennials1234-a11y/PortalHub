"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
})

export async function updateProfile(formData: FormData) {
  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const updateData: Record<string, string> = {}
  if (parsed.data.full_name !== undefined)
    updateData.full_name = parsed.data.full_name
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio
  if (parsed.data.avatar_url !== undefined)
    updateData.avatar_url = parsed.data.avatar_url

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
