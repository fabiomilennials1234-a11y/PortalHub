---
tags:
  - dominio
  - organization
created: 2026-05-07
status: vivo
---

# Organization (Community)

Boundary de multi-tenancy. Toda entidade no sistema pertence a uma organization.

## Schema

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    theme_color TEXT DEFAULT '#6366f1',
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    org_id UUID NOT NULL REFERENCES organizations(id),
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'banned', 'pending')),
    points INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, org_id)
);
```

## Settings (JSONB)

```json
{
  "visibility": "public|private",
  "join_mode": "open|invite|approval",
  "gamification_enabled": true,
  "points_config": {
    "post_created": 10,
    "comment_created": 5,
    "lesson_completed": 20,
    "reaction_given": 2,
    "daily_login": 15
  }
}
```

## Roles

| Role | Permissoes |
|------|-----------|
| owner | Tudo. Gerencia planos, billing, membros, conteudo. |
| admin | Gerencia membros, conteudo, categorias, cursos. Sem billing. |
| moderator | Pin/lock posts, hide comments, gerencia reports. |
| member | Posta, comenta, reage, completa cursos, RSVP eventos. |
