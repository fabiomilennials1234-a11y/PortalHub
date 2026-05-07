---
tags:
  - dominio
  - course
created: 2026-05-07
status: vivo
---

# Course

Conteudo educacional estruturado. Revenue driver principal.

## Schema

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    access_type TEXT NOT NULL DEFAULT 'free' CHECK (access_type IN ('free', 'paid', 'level_locked')),
    required_level INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'embed')),
    video_url TEXT,
    text_content JSONB,
    duration_minutes INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);
```

## Access Control

| access_type | Quem ve |
|------------|---------|
| free | Todos os membros da community |
| paid | Membros com subscription ativa |
| level_locked | Membros com level >= required_level |

## Video Embed

Allowlist de domínios: youtube.com, youtu.be, vimeo.com, loom.com. URL parseada server-side. iframe com sandbox attribute.

## Progress Calculation

```
course_progress = (completed_lessons / total_lessons) * 100
module_progress = (completed_lessons_in_module / total_lessons_in_module) * 100
```
