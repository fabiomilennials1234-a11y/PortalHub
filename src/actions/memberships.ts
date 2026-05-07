"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const joinSchema = z.object({
  org_id: z.string().uuid(),
})

const updateRoleSchema = z.object({
  membership_id: z.string().uuid(),
  role: z.enum(["admin", "moderator", "member"]),
})

export async function joinOrganization(formData: FormData) {
  const parsed = joinSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase.from("memberships").insert({
    user_id: user.id,
    org_id: parsed.data.org_id,
    role: "member",
  })
  if (error) {
    if (error.code === "23505") return { error: "Já é membro" }
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function leaveOrganization(formData: FormData) {
  const parsed = joinSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("org_id", parsed.data.org_id)
    .single()

  if (membership?.role === "owner")
    return { error: "Owner não pode sair da organização" }

  const { error } = await supabase
    .from("memberships")
    .delete()
    .eq("user_id", user.id)
    .eq("org_id", parsed.data.org_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function updateMemberRole(formData: FormData) {
  const parsed = updateRoleSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()

  const { error } = await supabase
    .from("memberships")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.membership_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
