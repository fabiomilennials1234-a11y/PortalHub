"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createEventSchema = z.object({
  org_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  cover_url: z.string().url().optional().or(z.literal("")),
  starts_at: z.string().min(1),
  ends_at: z.string().min(1),
  location_url: z.string().url().optional().or(z.literal("")),
  location_label: z.string().max(200).optional().or(z.literal("")),
  max_attendees: z.coerce.number().int().min(1).optional(),
})

const updateEventSchema = z.object({
  event_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  cover_url: z.string().url().optional().or(z.literal("")),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  location_url: z.string().url().optional().or(z.literal("")),
  location_label: z.string().max(200).optional(),
  max_attendees: z.coerce.number().int().min(1).optional(),
  status: z.enum(["upcoming", "live", "ended", "cancelled"]).optional(),
})

const eventIdSchema = z.object({
  event_id: z.string().uuid(),
})

export async function createEvent(formData: FormData) {
  const parsed = createEventSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  if (new Date(parsed.data.ends_at) <= new Date(parsed.data.starts_at)) {
    return { error: "Fim deve ser após o início" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data, error } = await supabase
    .from("events")
    .insert({
      org_id: parsed.data.org_id,
      host_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      cover_url: parsed.data.cover_url || null,
      starts_at: parsed.data.starts_at,
      ends_at: parsed.data.ends_at,
      location_url: parsed.data.location_url || null,
      location_label: parsed.data.location_label || null,
      max_attendees: parsed.data.max_attendees ?? null,
    })
    .select()
    .single()
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data }
}

export async function updateEvent(formData: FormData) {
  const parsed = updateEventSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const updateData: Record<string, unknown> = {}

  if (parsed.data.title) updateData.title = parsed.data.title
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description || null
  if (parsed.data.cover_url !== undefined)
    updateData.cover_url = parsed.data.cover_url || null
  if (parsed.data.starts_at) updateData.starts_at = parsed.data.starts_at
  if (parsed.data.ends_at) updateData.ends_at = parsed.data.ends_at
  if (parsed.data.location_url !== undefined)
    updateData.location_url = parsed.data.location_url || null
  if (parsed.data.location_label !== undefined)
    updateData.location_label = parsed.data.location_label || null
  if (parsed.data.max_attendees !== undefined)
    updateData.max_attendees = parsed.data.max_attendees
  if (parsed.data.status) updateData.status = parsed.data.status

  const { error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", parsed.data.event_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteEvent(formData: FormData) {
  const parsed = eventIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", parsed.data.event_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function registerForEvent(formData: FormData) {
  const parsed = eventIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { data: event } = await supabase
    .from("events")
    .select("max_attendees, attendees_count")
    .eq("id", parsed.data.event_id)
    .single()

  if (
    event?.max_attendees !== null &&
    event?.max_attendees !== undefined &&
    event.attendees_count >= event.max_attendees
  ) {
    return { error: "Evento lotado" }
  }

  const { error } = await supabase
    .from("event_registrations")
    .upsert(
      { event_id: parsed.data.event_id, user_id: user.id },
      { onConflict: "event_id,user_id", ignoreDuplicates: true },
    )
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function unregisterFromEvent(formData: FormData) {
  const parsed = eventIdSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", parsed.data.event_id)
    .eq("user_id", user.id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
