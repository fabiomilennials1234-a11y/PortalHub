"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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

export async function submitReport(formData: FormData) {
  const parsed = createReportSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      org_id: parsed.data.org_id,
      reporter_id: user.id,
      target_type: parsed.data.target_type,
      target_id: parsed.data.target_id,
      reason: parsed.data.reason,
      description: parsed.data.description || null,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function resolveReport(formData: FormData) {
  const parsed = resolveReportSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const updateData: Record<string, unknown> = {
    status: parsed.data.status,
    resolved_by: user.id,
    resolution_note: parsed.data.resolution_note || null,
  }
  if (parsed.data.status !== "reviewing") {
    updateData.resolved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("reports")
    .update(updateData)
    .eq("id", parsed.data.report_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
