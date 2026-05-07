# PortalHub — Estrutura do Projeto

```
portalhub/
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── ph-engenheiro/SKILL.md
│       ├── ph-dev-senior/SKILL.md
│       └── ph-dev-pleno/SKILL.md
├── .specs/
│   ├── codebase/
│   │   ├── ARCHITECTURE.md
│   │   ├── CONVENTIONS.md
│   │   ├── STACK.md
│   │   └── STRUCTURE.md        ← voce esta aqui
│   ├── project/
│   │   ├── PROJECT.md
│   │   └── STATE.md
│   └── features/               # Feature specs por modulo
├── PortalHub-dir/               # Vault Obsidian (source of truth)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Rotas de autenticacao (login, signup, etc.)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (marketing)/         # Paginas publicas (landing, pricing)
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (platform)/          # Plataforma autenticada
│   │   │   ├── [orgSlug]/       # Rotas scoped por org
│   │   │   │   ├── community/
│   │   │   │   │   ├── page.tsx           # Feed
│   │   │   │   │   └── [postId]/page.tsx  # Post detail
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx           # Catalogo
│   │   │   │   │   └── [courseId]/
│   │   │   │   │       ├── page.tsx       # Course detail
│   │   │   │   │       └── [lessonId]/page.tsx  # Lesson player
│   │   │   │   ├── events/
│   │   │   │   │   ├── page.tsx           # Calendar
│   │   │   │   │   └── [eventId]/page.tsx # Event detail
│   │   │   │   ├── leaderboard/page.tsx
│   │   │   │   ├── members/
│   │   │   │   │   ├── page.tsx           # Member list
│   │   │   │   │   └── [userId]/page.tsx  # Profile
│   │   │   │   └── settings/             # Admin only
│   │   │   │       ├── page.tsx
│   │   │   │       ├── gamification/page.tsx
│   │   │   │       ├── billing/page.tsx
│   │   │   │       └── moderation/page.tsx
│   │   │   └── layout.tsx       # Platform shell (sidebar, header)
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Tailwind + CSS variables
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── community/           # PostCard, PostForm, CommentThread, ReactionBar, CategoryFilter
│   │   ├── courses/             # CourseCard, ModuleAccordion, LessonPlayer, ProgressBar
│   │   ├── gamification/        # LeaderboardCard, AchievementBadge, LevelBadge, StreakCounter, CelebrationEffect
│   │   ├── events/              # EventCard, Calendar, RSVPButton
│   │   ├── layout/              # Sidebar, Header, MobileNav, UserMenu
│   │   ├── notifications/       # NotificationDropdown, NotificationItem
│   │   └── shared/              # Avatar, RichTextEditor, MediaEmbed, EmptyState, SkeletonLoader
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client (createBrowserClient)
│   │   │   ├── server.ts        # Server client (createServerClient)
│   │   │   └── middleware.ts    # Middleware client
│   │   ├── stripe/
│   │   │   ├── client.ts        # Stripe instance
│   │   │   └── helpers.ts       # Checkout, portal helpers
│   │   ├── utils.ts             # cn(), formatDate(), etc.
│   │   └── constants.ts         # App-wide constants
│   ├── hooks/                   # TanStack Query hooks
│   │   ├── usePosts.ts
│   │   ├── useComments.ts
│   │   ├── useCourses.ts
│   │   ├── useLessons.ts
│   │   ├── useGamification.ts
│   │   ├── useNotifications.ts
│   │   ├── useMembers.ts
│   │   ├── useEvents.ts
│   │   └── useSubscription.ts
│   ├── actions/                 # Server Actions
│   │   ├── posts.ts
│   │   ├── comments.ts
│   │   ├── courses.ts
│   │   ├── memberships.ts
│   │   ├── events.ts
│   │   └── moderation.ts
│   └── types/
│       ├── database.types.ts    # Supabase generated (npx supabase gen types)
│       └── domain.ts            # App-level types
├── supabase/
│   ├── migrations/              # SQL migrations (YYYYMMDDHHMMSS_descricao.sql)
│   ├── functions/               # Edge Functions (Deno)
│   ├── config.toml
│   └── seed.sql                 # Dev seed data
├── tests/
│   ├── unit/                    # Vitest unit tests
│   ├── integration/             # Supabase integration tests
│   └── e2e/                     # Playwright E2E
├── public/
│   └── images/
├── .env.example
├── .env.local                   # Git ignored
├── .gitignore
├── CLAUDE.md
├── docker-compose.yml           # Local Supabase
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vitest.config.ts
```
