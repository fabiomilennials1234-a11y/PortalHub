---
tags:
  - dominio
  - gamification
created: 2026-05-07
status: vivo
---

# Gamification

Engagement loop. Pontos, niveis, achievements, leaderboard, streaks.

## Schema

```sql
CREATE TABLE point_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    org_id UUID NOT NULL REFERENCES organizations(id),
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    level_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL,
    icon TEXT,
    color TEXT,
    perks JSONB NOT NULL DEFAULT '{}',
    UNIQUE(org_id, level_number)
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('milestone', 'streak', 'special')),
    criteria JSONB NOT NULL,
    badge_url TEXT,
    points_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);
```

## Point Values (Default)

| Acao | Pontos |
|------|--------|
| post_created | 10 |
| comment_created | 5 |
| lesson_completed | 20 |
| reaction_given | 2 |
| daily_login | 15 |
| achievement_earned | Varies |

## Level Defaults

| Level | Nome | Min Points |
|-------|------|-----------|
| 1 | Novato | 0 |
| 2 | Participante | 50 |
| 3 | Contribuidor | 150 |
| 4 | Engajado | 400 |
| 5 | Expert | 1000 |
| 6 | Lenda | 2500 |

## Achievements Defaults

| Achievement | Tipo | Criterio |
|------------|------|----------|
| First Post | milestone | {action: "post_created", threshold: 1} |
| Commentator | milestone | {action: "comment_created", threshold: 10} |
| Scholar | milestone | {action: "lesson_completed", threshold: 10} |
| 7-Day Streak | streak | {days: 7} |
| 30-Day Streak | streak | {days: 30} |
| Course Completer | special | {courses_completed: 1} |

## Anti-abuse

- Max 100 pontos/dia de reactions (20 reactions * 2 pts)
- Cooldown: 1 reaction por target por dia
- Login streak: 1x por dia, detectado por date diff
