/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed crypto-traders org with heavy activity for performance testing.
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/seed-crypto-heavy.ts
 */

import { createClient } from "@supabase/supabase-js"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const ORG_SLUG = "crypto-traders"

// Tiptap helpers
function paragraph(text: string): unknown {
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  }
}

function richBody(...paragraphs: string[]): unknown {
  return {
    type: "doc",
    content: paragraphs.map((t) => ({
      type: "paragraph",
      content: [{ type: "text", text: t }],
    })),
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

const POST_TEMPLATES = [
  {
    title: "BTC quebrou $80k! Análise técnica do rompimento",
    body: [
      "Bitcoin acabou de quebrar resistência crítica em $80k.",
      "Volume de compra agressivo nas últimas 4h. RSI ainda saudável (62).",
      "Próximo alvo: $85k pela projeção de Fibonacci.",
      "Stop-loss sugerido: $77.500 pra preservar capital.",
    ],
  },
  {
    title: "ETH/BTC ratio em zona de acumulação histórica",
    body: [
      "Ratio ETH/BTC tocou 0.032 — mínima dos últimos 18 meses.",
      "Histórico mostra que esse nível foi seguido de rallies de 60%+ no ETH.",
      "Vejo oportunidade de rotacionar parte da posição BTC pra ETH agora.",
    ],
  },
  {
    title: "DeFi summer 2.0? TVL volta a crescer",
    body: [
      "Total Value Locked em DeFi cresceu 23% no último mês.",
      "Lido, EigenLayer e Pendle liderando a recuperação.",
      "Yields voltaram a níveis interessantes — 8-15% APY em stables.",
    ],
  },
  {
    title: "Pergunta: vale a pena entrar em altcoins agora?",
    body: [
      "Dúvida sincera: BTC.D em 56%, sinais de altseason próxima ou ainda cedo?",
      "Estou pensando em alocar 30% da carteira em alts mid-cap.",
      "Quem tem alguma análise pra compartilhar?",
    ],
  },
  {
    title: "Ganho mensal: +28% em outubro, dividindo a estratégia",
    body: [
      "Mês fechado, partilhando o que funcionou:",
      "1) DCA semanal em BTC + ETH (60% portfolio)",
      "2) Trades de swing em SOL e ARB (25%)",
      "3) Yield farming em curve+convex (15%)",
      "Disciplina > predição. Stop-loss religioso.",
    ],
  },
  {
    title: "Análise on-chain: whales acumulando há 3 semanas",
    body: [
      "Endereços com 1k+ BTC adicionaram +47k BTC desde 15/Out.",
      "Saídas de exchanges em máxima de 6 meses.",
      "Sinal claro de smart money se posicionando.",
    ],
  },
  {
    title: "Liquidações de $2.3B nas últimas 24h — o que aprendi",
    body: [
      "Mais um wipe out de leverage. Lições:",
      "Nunca usar mais de 3x leverage em posições direcionais.",
      "Hedge com puts OTM custa pouco e salva muito.",
    ],
  },
  {
    title: "Solana ecosystem: 5 projetos pra ficar de olho",
    body: [
      "Curiosidades: Jito, Pyth, Jupiter, Tensor e Helium Mobile.",
      "Crescimento de TVL e usuários consistente nos últimos 90 dias.",
      "DYOR sempre — não é recomendação.",
    ],
  },
  {
    title: "Bull cycle 2025: cronograma esperado",
    body: [
      "Histórico mostra padrão de 4 anos pos-halving.",
      "Pico provável Q4 2025 / Q1 2026.",
      "Tempo de DCA em assets de qualidade. Ignorar narrativa de curto prazo.",
    ],
  },
  {
    title: "Tax season chegando: como organizar trades crypto",
    body: [
      "Brasil tributa lucros acima de R$35k/mês em vendas crypto (15% até 5M).",
      "Uso CoinTracking + planilha pra reconciliar tudo.",
      "Quem usa outras ferramentas?",
    ],
  },
  {
    title: "Macro: Fed pode cortar 50bps em dezembro",
    body: [
      "Mercado precificando 78% de chance de corte de 50bps.",
      "Liquidez voltando ao sistema = bull pra risk assets.",
      "Crypto tende a ser primeiro a se beneficiar.",
    ],
  },
  {
    title: "Setup ganhador: triângulo simétrico em SOL",
    body: [
      "SOL formou triângulo simétrico nas últimas 3 semanas.",
      "Rompimento pra cima abre target de $250.",
      "Stop logo abaixo do suporte de $180.",
    ],
  },
  {
    title: "Risk management: position sizing baseado em ATR",
    body: [
      "Uso 1% de risco por trade calculado pelo ATR(14).",
      "Stop = entry - 1.5 * ATR. Position = (1% capital) / stop_distance.",
      "Sem isso eu já teria zerado a banca várias vezes.",
    ],
  },
  {
    title: "Boas práticas de custódia: hardware wallet ou cold storage?",
    body: [
      "Pra quantias > 10k USD → Ledger ou Trezor obrigatório.",
      "Multisig com 2-de-3 chaves pra cifras maiores.",
      "Nunca deixar mais que 2 meses de gastos em CEX.",
    ],
  },
  {
    title: "Layer 2s estão maturando: comparativo Arbitrum vs Base vs Optimism",
    body: [
      "Arbitrum: maior TVL, mais aplicações DeFi nativas.",
      "Base: crescimento explosivo de users (Coinbase backing).",
      "Optimism: foco em RetroPGF + superchains.",
      "Diversificar entre as 3 faz sentido pra exposição.",
    ],
  },
  {
    title: "Trading psychology: como lidar com FOMO",
    body: [
      "Já comprei topos de altcoins várias vezes por FOMO.",
      "Regra que mudou meu jogo: nunca comprar nos primeiros 3 dias de pump.",
      "Esperar correção de 15-20% antes de entrar.",
    ],
  },
  {
    title: "Novo airdrop: Hyperliquid HYPE token live!",
    body: [
      "Snapshot foi em novembro, claim aberto agora.",
      "Quem usou a Hyperliquid nos últimos 6 meses tem direito.",
      "Algumas wallets receberam 10k+ HYPE (US$ 50k+).",
    ],
  },
  {
    title: "Strategies: mean reversion vs momentum",
    body: [
      "Mean reversion funciona em ranges (60% do tempo).",
      "Momentum funciona em trends (40% do tempo).",
      "Identificar regime de mercado é 80% do trabalho.",
    ],
  },
  {
    title: "ETF spot Ethereum: fluxo positivo de $890M esta semana",
    body: [
      "Inflows institucionais voltando após 2 meses negativos.",
      "BlackRock ETHA liderando.",
      "Bullish pro ETH no curto prazo.",
    ],
  },
  {
    title: "Stablecoins yields: melhores opções hoje",
    body: [
      "Aave USDC: 6.2% APY",
      "Curve sDAI: 8.4% APY",
      "Pendle PT: 12-15% (com lock até maturidade)",
      "Avoid yields > 20% em stables — risco de smart contract alto.",
    ],
  },
  {
    title: "Erro comum: confundir HODL com paralisia",
    body: [
      "HODL ≠ não fazer nada. HODL bem feito tem rebalanceamento.",
      "Realizo lucros parciais a cada 50% de alta.",
      "Mantenho exposição mas protejo capital.",
    ],
  },
  {
    title: "Análise semanal: BTC em zona crítica de decisão",
    body: [
      "Suporte 78k está sendo testado pela 3a vez.",
      "Quebra abaixo abre target de 72k.",
      "Manutenção mantém estrutura de alta intacta.",
    ],
  },
  {
    title: "On-chain alert: USDT mint de $4B esta semana",
    body: [
      "Tether mintou $4B em USDT — sinal de demanda institucional.",
      "Historicamente precede movimentos de alta no BTC.",
      "Vamos ver se o pattern se mantém.",
    ],
  },
  {
    title: "Reflexão: por que 95% dos traders perdem dinheiro",
    body: [
      "Não é por falta de estratégia — é falta de disciplina.",
      "Overtrading, leverage abusivo, FOMO, revenge trading.",
      "Journaling diário foi o que mudou meu game.",
    ],
  },
  {
    title: "Macro: dolar index em zona crítica (DXY 106)",
    body: [
      "DXY testando suporte importante em 106.",
      "Quebra abaixo seria muito bullish pra crypto e gold.",
      "Manter posições estendidas mas com hedge.",
    ],
  },
  {
    title: "Iniciante: por onde começar a estudar trading?",
    body: [
      "Sou novo aqui, me indicam livros/cursos pra iniciantes?",
      "Já li 'O Investidor Inteligente' do Graham.",
      "Quero focar em análise técnica + risk management.",
    ],
  },
  {
    title: "Lições de 7 anos no mercado crypto",
    body: [
      "Sobreviver é mais importante que ganhar.",
      "Tempo no mercado > timing do mercado.",
      "Conviction sem flexibilidade é arrogância.",
    ],
  },
  {
    title: "DeFi 2.0: o que mudou desde 2021",
    body: [
      "Yields menores mas sustentáveis (não Ponzi).",
      "Foco em real yield (revenue dos protocolos).",
      "Composability mais segura com auditorias rigorosas.",
    ],
  },
  {
    title: "Trade do dia: long ARB com stop apertado",
    body: [
      "ARB rompendo triangulo em $0.85.",
      "Target 1: $1.05 (24%). Target 2: $1.25 (47%).",
      "Stop: $0.78 (-8%). RR favorável.",
    ],
  },
  {
    title: "Oportunidade institucional: BlackRock vai listar BTC ETF na Brasil",
    body: [
      "Confirmação semana passada: B3 vai aprovar listagem.",
      "Maior acesso pra investidores brasileiros.",
      "Bull pra adoção de longo prazo.",
    ],
  },
]

const COMMENT_REPLIES = [
  "Concordo total. Fiz análise parecida.",
  "Bom ponto. Não tinha pensado por esse ângulo.",
  "Vou esperar confirmação de volume antes de entrar.",
  "Stop em $77.500 me parece apertado demais. Eu coloco em $76k.",
  "Já estou comprado desde $72k, segurando.",
  "Cuidado com a correlação SP500. Macro tá frágil.",
  "Excelente análise! Salvei pra revisitar.",
  "Concordo com o setup mas timing tá complicado.",
  "Tô fora de risco. Mercado tá esticado.",
  "Compartilha o gráfico se puder?",
  "Risco-retorno desfavorável na minha opinião.",
  "Setup limpo. Boa sorte!",
  "Cuidado com manipulação. Volume tá baixo.",
  "Outra leitura: pode ser bull trap.",
  "Concordo que liquidez é o driver principal.",
]

const COURSE_TEMPLATES = [
  {
    slug: "fundamentos-trading-crypto",
    title: "Fundamentos do Trading Cripto",
    description:
      "Do zero ao primeiro trade. Análise técnica básica, risk management e psicologia.",
    modules: [
      {
        title: "Introdução ao mercado",
        lessons: [
          { title: "Bem-vindo ao curso", duration: 240, preview: true },
          { title: "Como funcionam exchanges", duration: 540 },
          { title: "Custódia: hot wallets vs cold wallets", duration: 720 },
        ],
      },
      {
        title: "Análise técnica essencial",
        lessons: [
          { title: "Suporte e resistência", duration: 600 },
          { title: "Médias móveis", duration: 480 },
          { title: "Padrões de candlestick", duration: 900 },
          { title: "RSI e divergências", duration: 720 },
        ],
      },
      {
        title: "Risk management",
        lessons: [
          { title: "Position sizing 1% rule", duration: 540 },
          { title: "Stop-loss e take-profit", duration: 480 },
          { title: "Risk-reward ratio", duration: 360 },
        ],
      },
    ],
  },
  {
    slug: "analise-on-chain",
    title: "Análise On-Chain Avançada",
    description:
      "Leia o blockchain como um livro aberto. Glassnode, Arkham, Nansen e mais.",
    modules: [
      {
        title: "Métricas fundamentais",
        lessons: [
          { title: "Active addresses", duration: 480, preview: true },
          { title: "Exchange flows", duration: 600 },
          { title: "MVRV ratio", duration: 720 },
        ],
      },
      {
        title: "Whale watching",
        lessons: [
          { title: "Identificando whales", duration: 540 },
          { title: "Análise de cohorts", duration: 660 },
          { title: "Smart money tracking", duration: 780 },
        ],
      },
    ],
  },
  {
    slug: "defi-yields",
    title: "DeFi Yields Profissional",
    description:
      "Maximize seus yields sem rugar. Curve, Aave, Pendle e estratégias auto-compounding.",
    modules: [
      {
        title: "Lending protocols",
        lessons: [
          { title: "Aave básico", duration: 480, preview: true },
          { title: "Compound vs Aave", duration: 600 },
        ],
      },
      {
        title: "DEX liquidity",
        lessons: [
          { title: "Curve stable pools", duration: 720 },
          { title: "Concentrated liquidity (Uniswap V3)", duration: 900 },
          { title: "Impermanent loss explicado", duration: 540 },
        ],
      },
    ],
  },
]

async function main() {
  console.log("→ Loading users + org")
  const { data: org } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", ORG_SLUG)
    .single()
  if (!org) throw new Error(`Org ${ORG_SLUG} not found`)

  const { data: members } = await admin
    .from("memberships")
    .select("user_id, role")
    .eq("org_id", org.id)
  if (!members?.length) throw new Error("No members")

  const memberIds = members.map((m) => m.user_id)
  console.log(`  ✓ ${memberIds.length} members in org`)

  // Categories — get existing
  const { data: cats } = await admin
    .from("categories")
    .select("id, slug")
    .eq("org_id", org.id)
  const catIds = (cats ?? []).map((c) => c.id)
  console.log(`  ✓ ${catIds.length} categories`)

  // ── POSTS ──
  console.log("→ Creating posts...")
  const createdPostIds: string[] = []
  for (const tpl of POST_TEMPLATES) {
    const { data: existing } = await admin
      .from("posts")
      .select("id")
      .eq("org_id", org.id)
      .eq("title", tpl.title)
      .maybeSingle()
    if (existing) {
      createdPostIds.push(existing.id)
      continue
    }
    const { data: post, error } = await admin
      .from("posts")
      .insert({
        org_id: org.id,
        author_id: pick(memberIds),
        category_id: pick(catIds),
        title: tpl.title,
        body: richBody(...tpl.body) as any,
        published: true,
        pinned: tpl.title.includes("BTC quebrou"),
      })
      .select("id")
      .single()
    if (error) {
      console.error("post error:", error.message)
      continue
    }
    createdPostIds.push(post.id)
  }
  console.log(`  ✓ ${createdPostIds.length} posts`)

  // ── COMMENTS ──
  console.log("→ Creating comments...")
  let commentCount = 0
  for (const postId of createdPostIds) {
    const replyCount = 2 + Math.floor(Math.random() * 4) // 2-5 replies
    const topLevelIds: string[] = []
    for (let i = 0; i < replyCount; i++) {
      const { data: c } = await admin
        .from("comments")
        .insert({
          post_id: postId,
          author_id: pick(memberIds),
          body: paragraph(pick(COMMENT_REPLIES)) as any,
        })
        .select("id")
        .single()
      if (c) {
        topLevelIds.push(c.id)
        commentCount++
      }
    }
    // 30% chance of nested reply
    if (topLevelIds.length > 0 && Math.random() > 0.7) {
      await admin.from("comments").insert({
        post_id: postId,
        author_id: pick(memberIds),
        parent_id: pick(topLevelIds),
        body: paragraph(pick(COMMENT_REPLIES)) as any,
      })
      commentCount++
    }
  }
  console.log(`  ✓ ${commentCount} comments`)

  // ── REACTIONS ──
  console.log("→ Creating reactions...")
  const reactionTypes: string[] = ["like", "love", "insightful", "fire"]
  let reactionCount = 0
  for (const postId of createdPostIds) {
    const reactors = pickN(memberIds, 1 + Math.floor(Math.random() * 4))
    for (const userId of reactors) {
      const { error } = await admin.from("reactions").upsert(
        {
          user_id: userId,
          target_type: "post",
          target_id: postId,
          reaction_type: pick(reactionTypes),
        },
        { onConflict: "user_id,target_type,target_id" },
      )
      if (!error) reactionCount++
    }
  }
  console.log(`  ✓ ${reactionCount} reactions`)

  // ── COURSES ──
  console.log("→ Creating courses...")
  for (const courseTpl of COURSE_TEMPLATES) {
    const { data: existing } = await admin
      .from("courses")
      .select("id")
      .eq("org_id", org.id)
      .eq("slug", courseTpl.slug)
      .maybeSingle()
    if (existing) {
      console.log(`  · skip ${courseTpl.slug}`)
      continue
    }
    const { data: course, error: courseErr } = await admin
      .from("courses")
      .insert({
        org_id: org.id,
        author_id: pick(memberIds),
        title: courseTpl.title,
        slug: courseTpl.slug,
        description: courseTpl.description,
        status: "published",
      })
      .select("id")
      .single()
    if (courseErr) {
      console.error("course err:", courseErr.message)
      continue
    }
    let modPos = 0
    for (const modTpl of courseTpl.modules) {
      const { data: mod } = await admin
        .from("modules")
        .insert({
          course_id: course.id,
          title: modTpl.title,
          position: modPos++,
        })
        .select("id")
        .single()
      if (!mod) continue
      let lessonPos = 0
      for (const l of modTpl.lessons) {
        await admin.from("lessons").insert({
          module_id: mod.id,
          title: l.title,
          content_type: "video",
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration_seconds: l.duration,
          position: lessonPos++,
          is_free_preview: l.preview ?? false,
        })
      }
    }
    console.log(`  ✓ ${courseTpl.title}`)
  }

  // ── EVENTS ──
  console.log("→ Creating events...")
  const now = Date.now()
  const events = [
    {
      title: "Live: Análise semanal do mercado",
      desc: "Análise técnica + on-chain dos principais ativos.",
      starts: new Date(now + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      status: "upcoming" as const,
      location: "Zoom",
    },
    {
      title: "Workshop: Setup de wallet hardware",
      desc: "Configure Ledger do zero, restore e troubleshoot.",
      starts: new Date(now + 5 * 24 * 60 * 60 * 1000),
      duration: 120,
      status: "upcoming" as const,
      location: "Discord Voice",
    },
    {
      title: "AMA: Trading psychology com convidado especial",
      desc: "Tire dúvidas sobre disciplina e mindset com trader profissional.",
      starts: new Date(now + 9 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: "upcoming" as const,
      location: "X Spaces",
    },
    {
      title: "Live agora: BTC breakout discussion",
      desc: "Discussão ao vivo sobre o rompimento de $80k.",
      starts: new Date(now - 30 * 60 * 1000),
      duration: 90,
      status: "live" as const,
      location: "Zoom",
    },
    {
      title: "Workshop passado: DeFi yields strategy",
      desc: "Workshop gravado sobre estratégias DeFi.",
      starts: new Date(now - 12 * 24 * 60 * 60 * 1000),
      duration: 120,
      status: "ended" as const,
      location: "Online",
    },
    {
      title: "Webinar passado: On-chain analysis 101",
      desc: "Introdução à análise on-chain.",
      starts: new Date(now - 25 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: "ended" as const,
      location: "Zoom",
    },
  ]

  for (const e of events) {
    const { data: existing } = await admin
      .from("events")
      .select("id")
      .eq("org_id", org.id)
      .eq("title", e.title)
      .maybeSingle()
    if (existing) continue
    await admin.from("events").insert({
      org_id: org.id,
      host_id: pick(memberIds),
      title: e.title,
      description: e.desc,
      status: e.status,
      starts_at: e.starts.toISOString(),
      ends_at: new Date(
        e.starts.getTime() + e.duration * 60 * 1000,
      ).toISOString(),
      location_label: e.location,
      location_url:
        e.location === "Zoom"
          ? "https://zoom.us/j/123456789"
          : "https://discord.gg/example",
      max_attendees: 100,
    })
  }
  console.log(`  ✓ ${events.length} events`)

  // ── EVENT REGISTRATIONS ──
  console.log("→ Creating event registrations...")
  const { data: orgEvents } = await admin
    .from("events")
    .select("id, status")
    .eq("org_id", org.id)
  let regCount = 0
  for (const e of orgEvents ?? []) {
    const attendees = pickN(memberIds, 2 + Math.floor(Math.random() * 3))
    for (const u of attendees) {
      const { error } = await admin.from("event_registrations").upsert(
        { event_id: e.id, user_id: u },
        { onConflict: "event_id,user_id" },
      )
      if (!error) regCount++
    }
  }
  console.log(`  ✓ ${regCount} registrations`)

  // ── ENROLLMENTS in new courses ──
  console.log("→ Creating enrollments...")
  const { data: orgCourses } = await admin
    .from("courses")
    .select("id")
    .eq("org_id", org.id)
  let enrollCount = 0
  for (const c of orgCourses ?? []) {
    const enrollees = pickN(memberIds, 2 + Math.floor(Math.random() * 3))
    for (const u of enrollees) {
      const { error } = await admin.from("enrollments").upsert(
        { course_id: c.id, user_id: u },
        { onConflict: "user_id,course_id" },
      )
      if (!error) enrollCount++
    }
  }
  console.log(`  ✓ ${enrollCount} enrollments`)

  console.log("\n✅ Crypto Traders heavy seed complete!")
  console.log(
    `\nTotals: ${createdPostIds.length} posts · ${commentCount} comments · ${reactionCount} reactions · 3 courses · ${events.length} events · ${regCount} regs · ${enrollCount} enrolls`,
  )
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
