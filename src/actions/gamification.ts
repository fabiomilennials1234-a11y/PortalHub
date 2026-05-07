"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createAchievementSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  type: z.enum(["milestone", "streak", "special"]),
  criteria: z.string().min(1),
  icon: z.string().max(50).optional().or(z.literal("")),
  color: z.string().max(20).optional().or(z.literal("")),
  points_reward: z.coerce.number().int().min(0).default(0),
})

const updateAchievementSchema = z.object({
  achievement_id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  criteria: z.string().optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(20).optional(),
  points_reward: z.coerce.number().int().min(0).optional(),
})

const achievementIdSchema = z.object({
  achievement_id: z.string().uuid(),
})

const updateLevelSchema = z.object({
  level_id: z.string().uuid(),
  name: z.string().min(1).max(50).optional(),
  min_points: z.coerce.number().int().min(0).optional(),
  color: z.string().max(20).optional(),
})

export async function createAchievement(formData: FormData) {
  const parsed = createAchievementSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  let criteriaJson: unknown
  try {
    criteriaJson = JSON.parse(parsed.data.criteria)
  } catch {
    return { error: "Critério inválido (JSON)" }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("achievements")
    .insert({
      org_id: parsed.data.org_id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      type: parsed.data.type,
      criteria: criteriaJson as never,
      icon: parsed.data.icon || null,
      color: parsed.data.color || null,
      points_reward: parsed.data.points_reward,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updateAchievement(formData: FormData) {
  const parsed = updateAchievementSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.name) updateData.name = parsed.data.name
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null
  if (parsed.data.criteria) {
    try {
      updateData.criteria = JSON.parse(parsed.data.criteria)
    } catch {
      return { error: "Critério inválido (JSON)" }
    }
  }
  if (parsed.data.icon !== undefined) updateData.icon = parsed.data.icon || null
  if (parsed.data.color !== undefined)
    updateData.color = parsed.data.color || null
  if (parsed.data.points_reward !== undefined)
    updateData.points_reward = parsed.data.points_reward

  const { error } = await supabase
    .from("achievements")
    .update(updateData)
    .eq("id", parsed.data.achievement_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteAchievement(formData: FormData) {
  const parsed = achievementIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("achievements")
    .delete()
    .eq("id", parsed.data.achievement_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function updateLevel(formData: FormData) {
  const parsed = updateLevelSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}
  if (parsed.data.name) updateData.name = parsed.data.name
  if (parsed.data.min_points !== undefined)
    updateData.min_points = parsed.data.min_points
  if (parsed.data.color) updateData.color = parsed.data.color

  const { error } = await supabase
    .from("levels")
    .update(updateData)
    .eq("id", parsed.data.level_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
