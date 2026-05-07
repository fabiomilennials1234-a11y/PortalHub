/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

function paragraph(text: string) {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  }
}

async function main() {
  const { data: modules } = await admin.from("modules").select("id, title")
  for (const mod of modules ?? []) {
    const { count } = await admin
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("module_id", mod.id)
    if (count && count > 0) {
      console.log("skip", mod.title)
      continue
    }

    const { error } = await admin.from("lessons").insert([
      {
        module_id: mod.id,
        title: "Aula 1 — Boas-vindas",
        description: "Apresentação do curso.",
        content_type: "video",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration_seconds: 180,
        position: 0,
        is_free_preview: true,
      },
      {
        module_id: mod.id,
        title: "Aula 2 — Conceitos chave",
        description: "Os pilares fundamentais.",
        content_type: "text",
        text_content: paragraph("Conteúdo da aula 2.") as any,
        duration_seconds: 600,
        position: 1,
        is_free_preview: false,
      },
      {
        module_id: mod.id,
        title: "Aula 3 — Próximos passos",
        description: "Como continuar.",
        content_type: "text",
        text_content: paragraph("Parabéns por completar!") as any,
        duration_seconds: 300,
        position: 2,
        is_free_preview: false,
      },
    ])
    if (error) console.error("Module", mod.id, error.message)
    else console.log("✓", mod.title)
  }
}

main()
