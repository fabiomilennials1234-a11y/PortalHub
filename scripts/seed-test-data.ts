/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed test communities for local development.
 *
 * Run with: npx tsx scripts/seed-test-data.ts
 *
 * Creates:
 *  - 8 test users (owners, admins, moderators, members)
 *  - 3 test organizations covering different scenarios
 *  - Categories, posts, comments, reactions
 *  - Courses with modules and lessons
 *  - Events (upcoming + past)
 *  - Plans (free + paid)
 *  - Reports (some pending, some resolved)
 *  - Notifications + activity (gerados via triggers)
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Source .env.local first.",
  )
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ──────────────────────────────────────────────────────────
// Test users
// ──────────────────────────────────────────────────────────

const USERS = [
  {
    email: "fabio@portalhub.test",
    password: "test1234",
    full_name: "Fabio Founder",
    bio: "Construindo PortalHub. CTO + fundador.",
  },
  {
    email: "maria@portalhub.test",
    password: "test1234",
    full_name: "Maria Marketing",
    bio: "Marketing strategist · ex Hotmart",
  },
  {
    email: "joao@portalhub.test",
    password: "test1234",
    full_name: "João Trader",
    bio: "Crypto + DeFi · 7 anos no mercado",
  },
  {
    email: "ana@portalhub.test",
    password: "test1234",
    full_name: "Ana Yoga",
    bio: "Yoga teacher · meditação · wellness",
  },
  {
    email: "lucas@portalhub.test",
    password: "test1234",
    full_name: "Lucas Dev",
    bio: "Full-stack engineer · open source",
  },
  {
    email: "julia@portalhub.test",
    password: "test1234",
    full_name: "Julia Designer",
    bio: "Product designer · ex Stripe",
  },
  {
    email: "pedro@portalhub.test",
    password: "test1234",
    full_name: "Pedro Pro",
    bio: "Empreendedor digital",
  },
  {
    email: "carla@portalhub.test",
    password: "test1234",
    full_name: "Carla Content",
    bio: "Content creator · 50k followers",
  },
]

async function ensureUser(u: (typeof USERS)[number]): Promise<string> {
  // Try create user. If exists, fetch by listing.
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.full_name },
  })

  if (data?.user) {
    await admin
      .from("profiles")
      .update({ full_name: u.full_name, bio: u.bio })
      .eq("id", data.user.id)
    return data.user.id
  }

  if (error && /already/i.test(error.message)) {
    // Find existing
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
    const found = list?.users.find((x) => x.email === u.email)
    if (found) {
      await admin
        .from("profiles")
        .update({ full_name: u.full_name, bio: u.bio })
        .eq("id", found.id)
      return found.id
    }
  }

  throw new Error(`Failed to ensure user ${u.email}: ${error?.message}`)
}

// ──────────────────────────────────────────────────────────
// Organizations
// ──────────────────────────────────────────────────────────

interface OrgSpec {
  slug: string
  name: string
  description: string
  ownerEmail: string
  members: { email: string; role: "admin" | "moderator" | "member" }[]
}

const ORGS: OrgSpec[] = [
  {
    slug: "marketing-pros",
    name: "Marketing Pros",
    description:
      "Comunidade de marketing digital pra criadores e empreendedores que querem escalar.",
    ownerEmail: "maria@portalhub.test",
    members: [
      { email: "fabio@portalhub.test", role: "admin" },
      { email: "lucas@portalhub.test", role: "moderator" },
      { email: "julia@portalhub.test", role: "member" },
      { email: "pedro@portalhub.test", role: "member" },
      { email: "carla@portalhub.test", role: "member" },
    ],
  },
  {
    slug: "crypto-traders",
    name: "Crypto Traders BR",
    description:
      "Análise de mercado, sinais, DeFi e estratégias de trading. Comunidade premium.",
    ownerEmail: "joao@portalhub.test",
    members: [
      { email: "fabio@portalhub.test", role: "moderator" },
      { email: "pedro@portalhub.test", role: "member" },
      { email: "lucas@portalhub.test", role: "member" },
    ],
  },
  {
    slug: "yoga-wellness",
    name: "Yoga & Wellness",
    description:
      "Aulas de yoga, meditação guiada e práticas de wellness. Para mente e corpo.",
    ownerEmail: "ana@portalhub.test",
    members: [
      { email: "julia@portalhub.test", role: "member" },
      { email: "carla@portalhub.test", role: "member" },
      { email: "maria@portalhub.test", role: "member" },
    ],
  },
]

// ──────────────────────────────────────────────────────────
// Helpers — Tiptap JSON content
// ──────────────────────────────────────────────────────────

function paragraph(text: string): unknown {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  }
}

function multiParagraph(...texts: string[]): unknown {
  return {
    type: "doc",
    content: texts.map((t) => ({
      type: "paragraph",
      content: [{ type: "text", text: t }],
    })),
  }
}

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────

async function main() {
  console.log("→ Creating users...")
  const userIds: Record<string, string> = {}
  for (const u of USERS) {
    userIds[u.email] = await ensureUser(u)
    console.log(`  ✓ ${u.email}`)
  }

  for (const orgSpec of ORGS) {
    console.log(`\n→ Org: ${orgSpec.name}`)

    // Upsert org
    const ownerId = userIds[orgSpec.ownerEmail]
    const { data: existingOrg } = await admin
      .from("organizations")
      .select("id")
      .eq("slug", orgSpec.slug)
      .maybeSingle()

    let orgId: string
    if (existingOrg) {
      orgId = existingOrg.id
      console.log(`  ✓ exists`)
    } else {
      const { data: org, error } = await admin
        .from("organizations")
        .insert({
          slug: orgSpec.slug,
          name: orgSpec.name,
          description: orgSpec.description,
          owner_id: ownerId,
          theme_color: "#6366f1",
        })
        .select("id")
        .single()
      if (error) throw error
      orgId = org.id
      console.log(`  ✓ created`)
    }

    // Owner membership
    await admin.from("memberships").upsert(
      {
        user_id: ownerId,
        org_id: orgId,
        role: "owner",
        status: "active",
      },
      { onConflict: "user_id,org_id" },
    )

    // Other members
    for (const m of orgSpec.members) {
      await admin.from("memberships").upsert(
        {
          user_id: userIds[m.email],
          org_id: orgId,
          role: m.role,
          status: "active",
        },
        { onConflict: "user_id,org_id" },
      )
    }
    console.log(`  ✓ ${orgSpec.members.length + 1} memberships`)

    // Categories
    const categoryDefs = [
      { name: "Geral", slug: "geral", color: "#6366f1", position: 0 },
      { name: "Anúncios", slug: "anuncios", color: "#f59e0b", position: 1 },
      { name: "Discussão", slug: "discussao", color: "#10b981", position: 2 },
      { name: "Dúvidas", slug: "duvidas", color: "#ec4899", position: 3 },
    ]
    const categoryIds: Record<string, string> = {}
    for (const c of categoryDefs) {
      const { data: existing } = await admin
        .from("categories")
        .select("id")
        .eq("org_id", orgId)
        .eq("slug", c.slug)
        .maybeSingle()
      if (existing) {
        categoryIds[c.slug] = existing.id
      } else {
        const { data: cat, error } = await admin
          .from("categories")
          .insert({ org_id: orgId, ...c })
          .select("id")
          .single()
        if (error) throw error
        categoryIds[c.slug] = cat.id
      }
    }
    console.log(`  ✓ 4 categories`)

    // Posts
    const postsToCreate = [
      {
        category: "anuncios",
        author: orgSpec.ownerEmail,
        title: `Bem-vindos à ${orgSpec.name}!`,
        body: multiParagraph(
          `Olá pessoal! Sejam muito bem-vindos à nossa comunidade.`,
          `Aqui você vai encontrar conteúdo de qualidade, networking e muita troca.`,
          `Comecem se apresentando nos comentários!`,
        ),
        pinned: true,
      },
      {
        category: "discussao",
        author: orgSpec.members[0]?.email ?? orgSpec.ownerEmail,
        title: "Qual sua principal meta pra 2026?",
        body: paragraph(
          "Vamos compartilhar metas pra 2026 e nos ajudar a atingir!",
        ),
        pinned: false,
      },
      {
        category: "duvidas",
        author:
          orgSpec.members[1]?.email ??
          orgSpec.members[0]?.email ??
          orgSpec.ownerEmail,
        title: "Como começar do zero nessa área?",
        body: paragraph("Sou iniciante, alguma dica de por onde começar?"),
        pinned: false,
      },
      {
        category: "geral",
        author:
          orgSpec.members[2]?.email ??
          orgSpec.members[0]?.email ??
          orgSpec.ownerEmail,
        title: "Compartilhando uma vitória 🎉",
        body: paragraph(
          "Aplicando o que aprendi aqui consegui meu primeiro grande resultado!",
        ),
        pinned: false,
      },
    ]

    const postIds: string[] = []
    for (const p of postsToCreate) {
      const { data: existingPosts } = await admin
        .from("posts")
        .select("id")
        .eq("org_id", orgId)
        .eq("title", p.title)
        .maybeSingle()
      if (existingPosts) {
        postIds.push(existingPosts.id)
        continue
      }
      const { data: post, error } = await admin
        .from("posts")
        .insert({
          org_id: orgId,
          author_id: userIds[p.author],
          category_id: categoryIds[p.category],
          title: p.title,
          body: p.body as any,
          pinned: p.pinned,
          published: true,
        })
        .select("id")
        .single()
      if (error) throw error
      postIds.push(post.id)
    }
    console.log(`  ✓ ${postIds.length} posts`)

    // Comments — top-level + replies
    if (postIds.length > 0) {
      const firstPostId = postIds[0]
      const { count: existingComments } = await admin
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", firstPostId)

      if (!existingComments || existingComments === 0) {
        const commenter1 =
          userIds[orgSpec.members[0]?.email ?? orgSpec.ownerEmail]
        const commenter2 =
          userIds[orgSpec.members[1]?.email ?? orgSpec.ownerEmail]

        const { data: c1 } = await admin
          .from("comments")
          .insert({
            post_id: firstPostId,
            author_id: commenter1,
            body: paragraph("Primeiro! Animado pra fazer parte 🚀") as any,
          })
          .select("id")
          .single()

        await admin.from("comments").insert({
          post_id: firstPostId,
          author_id: commenter2,
          body: paragraph("Bem-vindo! Conta um pouco do que faz.") as any,
          parent_id: c1?.id,
        })

        await admin.from("comments").insert({
          post_id: firstPostId,
          author_id: commenter2,
          body: paragraph("Acabei de entrar também, vamos conectar.") as any,
        })
      }
      console.log(`  ✓ comments seeded`)
    }

    // Reactions on first post
    if (postIds.length > 0) {
      const reactors = orgSpec.members.slice(0, 3).map((m) => userIds[m.email])
      const reactionTypes = ["like", "love", "fire"] as const
      for (let i = 0; i < reactors.length; i++) {
        await admin.from("reactions").upsert(
          {
            user_id: reactors[i],
            target_type: "post",
            target_id: postIds[0],
            reaction_type: reactionTypes[i % reactionTypes.length],
          },
          { onConflict: "user_id,target_type,target_id" },
        )
      }
      console.log(`  ✓ reactions seeded`)
    }

    // Course
    const { data: existingCourse } = await admin
      .from("courses")
      .select("id")
      .eq("org_id", orgId)
      .eq("slug", "intro-curso")
      .maybeSingle()

    let courseId: string
    if (existingCourse) {
      courseId = existingCourse.id
    } else {
      const { data: course, error } = await admin
        .from("courses")
        .insert({
          org_id: orgId,
          author_id: ownerId,
          title: `Introdução — ${orgSpec.name}`,
          slug: "intro-curso",
          description: `Curso de introdução à ${orgSpec.name}. Comece por aqui.`,
          status: "published",
          access_type: "free",
        })
        .select("id")
        .single()
      if (error) throw error
      courseId = course.id

      // Module + 3 lessons
      const { data: mod, error: modErr } = await admin
        .from("modules")
        .insert({
          course_id: courseId,
          title: "Fundamentos",
          position: 0,
        })
        .select("id")
        .single()
      if (modErr) throw modErr

      await admin.from("lessons").insert([
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
          text_content: multiParagraph(
            "Nesta aula vamos cobrir os conceitos básicos.",
            "Anote tudo e depois discuta na comunidade.",
          ) as any,
          duration_seconds: 600,
          position: 1,
        },
        {
          module_id: mod.id,
          title: "Aula 3 — Próximos passos",
          description: "Como continuar.",
          content_type: "text",
          text_content: paragraph(
            "Parabéns por completar o módulo! Continue praticando.",
          ) as any,
          duration_seconds: 300,
          position: 2,
        },
      ])
    }
    console.log(`  ✓ course + 3 lessons`)

    // Plan
    const { data: existingPlan } = await admin
      .from("plans")
      .select("id")
      .eq("org_id", orgId)
      .eq("name", "Pro")
      .maybeSingle()

    if (!existingPlan) {
      await admin.from("plans").insert({
        org_id: orgId,
        name: "Pro",
        description: `Acesso completo a ${orgSpec.name}: cursos, eventos exclusivos e suporte prioritário.`,
        price_cents: orgSpec.slug === "crypto-traders" ? 9900 : 2900,
        currency: "usd",
        interval: "month",
        active: true,
        features: [
          { label: "Acesso a todos os cursos", included: true },
          { label: "Eventos exclusivos ao vivo", included: true },
          { label: "Comunidade privada", included: true },
          { label: "Suporte prioritário", included: true },
          { label: "Mentoria 1:1", included: false },
        ] as any,
      })
    }
    console.log(`  ✓ plan`)

    // Events — 1 upcoming + 1 past
    const now = new Date()
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const { data: existingEvents } = await admin
      .from("events")
      .select("id")
      .eq("org_id", orgId)
      .limit(1)

    if (!existingEvents || existingEvents.length === 0) {
      await admin.from("events").insert([
        {
          org_id: orgId,
          host_id: ownerId,
          title: `Encontro semanal — ${orgSpec.name}`,
          description:
            "Encontro semanal de discussão. Traga suas dúvidas e cases.",
          status: "upcoming",
          starts_at: future.toISOString(),
          ends_at: new Date(
            future.getTime() + 60 * 60 * 1000,
          ).toISOString(),
          location_label: "Zoom",
          location_url: "https://zoom.us/j/123456789",
          max_attendees: 50,
        },
        {
          org_id: orgId,
          host_id: ownerId,
          title: "Workshop de abertura (gravado)",
          description: "Workshop de inauguração da comunidade.",
          status: "ended",
          starts_at: past.toISOString(),
          ends_at: new Date(past.getTime() + 90 * 60 * 1000).toISOString(),
          location_label: "Online",
        },
      ])
    }
    console.log(`  ✓ 2 events (1 upcoming, 1 past)`)
  }

  console.log("\n→ Seeding extra: a report on Marketing Pros for moderation queue")
  const { data: marketingOrg } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", "marketing-pros")
    .single()

  const { data: somePost } = await admin
    .from("posts")
    .select("id, author_id")
    .eq("org_id", marketingOrg!.id)
    .limit(1)
    .maybeSingle()

  if (somePost) {
    const { count } = await admin
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("target_id", somePost.id)

    if (!count) {
      await admin.from("reports").insert({
        org_id: marketingOrg!.id,
        reporter_id: userIds["pedro@portalhub.test"],
        target_type: "post",
        target_id: somePost.id,
        reason: "spam",
        description: "Esse post parece promocional sem contexto.",
        status: "pending",
      })
      console.log(`  ✓ 1 pending report`)
    }
  }

  console.log("\n✅ Seed complete!")
  console.log("\nLogin credentials (all users):")
  console.log("  password: test1234")
  console.log("\nUsers:")
  for (const u of USERS) {
    console.log(`  ${u.email}  →  ${u.full_name}`)
  }
  console.log("\nOrgs:")
  for (const o of ORGS) {
    console.log(`  /${o.slug}/community  →  ${o.name} (owner: ${o.ownerEmail})`)
  }
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
