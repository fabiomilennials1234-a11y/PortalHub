"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug: apenas letras minúsculas, números e hífens"),
  description: z.string().max(500).optional(),
})

const updateOrgSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  banner_url: z.string().url().optional().or(z.literal("")),
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
})

export async function createOrganization(formData: FormData) {
  const parsed = createOrgSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      owner_id: user.id,
    })
    .select()
    .single()
  if (orgError) {
    if (orgError.code === "23505") return { error: "Slug já existe" }
    return { error: orgError.message }
  }

  const { error: memberError } = await supabase.from("memberships").insert({
    user_id: user.id,
    org_id: org.id,
    role: "owner",
  })
  if (memberError) return { error: memberError.message }

  revalidatePath("/", "layout")
  redirect(`/${org.slug}/community`)
}

export async function updateOrganization(formData: FormData) {
  const parsed = updateOrgSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { org_id, ...updateData } = parsed.data

  const cleanData: Record<string, string | null> = {}
  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) cleanData[key] = value || null
  }

  const { error } = await supabase
    .from("organizations")
    .update(cleanData)
    .eq("id", org_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
