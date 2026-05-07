"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const idSchema = z.object({
  notification_id: z.string().uuid(),
})

export async function markNotificationRead(formData: FormData) {
  const parsed = idSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("id", parsed.data.notification_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("read", false)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}

export async function deleteNotification(formData: FormData) {
  const parsed = idSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", parsed.data.notification_id)
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  return { data: { success: true } }
}
