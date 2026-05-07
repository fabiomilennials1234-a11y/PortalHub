"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const MAX_BANNER_BYTES = 10 * 1024 * 1024

const bucketSchema = z.enum(["avatars", "banners", "covers"])

interface UploadResult {
  data?: { url: string; path: string }
  error?: string
}

function fileExt(name: string): string {
  const idx = name.lastIndexOf(".")
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : "bin"
}

function safeFilename(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Upload a single image to a public bucket.
 *
 * Path convention:
 *   avatars/{user_id}/{filename}
 *   banners/{org_id}/{filename}
 *   covers/{org_id}/{filename}
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const bucketRaw = formData.get("bucket")
  const file = formData.get("file")
  const orgId = formData.get("org_id")

  const bucketParse = bucketSchema.safeParse(bucketRaw)
  if (!bucketParse.success) return { error: "Bucket inválido" }
  const bucket = bucketParse.data

  if (!(file instanceof File)) return { error: "Arquivo ausente" }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Tipo de imagem não permitido" }
  }

  const maxBytes = bucket === "avatars" ? MAX_AVATAR_BYTES : MAX_BANNER_BYTES
  if (file.size > maxBytes) {
    return { error: `Arquivo maior que ${Math.round(maxBytes / 1024 / 1024)}MB` }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Não autenticado" }

  let folder: string
  if (bucket === "avatars") {
    folder = user.id
  } else {
    if (!orgId || typeof orgId !== "string") {
      return { error: "org_id obrigatório para esse bucket" }
    }
    folder = orgId
  }

  const path = `${folder}/${safeFilename()}.${fileExt(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) return { error: uploadError.message }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return { data: { url: publicUrl.publicUrl, path } }
}

const removeSchema = z.object({
  bucket: z.enum(["avatars", "banners", "covers"]),
  path: z.string().min(1),
})

export async function removeImage(formData: FormData) {
  const parsed = removeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Dados inválidos" }

  const supabase = await createClient()
  const { error } = await supabase.storage
    .from(parsed.data.bucket)
    .remove([parsed.data.path])

  if (error) return { error: error.message }
  return { data: { success: true } }
}
