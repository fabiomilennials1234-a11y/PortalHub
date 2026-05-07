---
tags:
  - moc
  - indice
  - raiz
status: vivo
created: 2026-05-07
---

# PortalHub — Indice Central

> **Comunidades + cursos all-in-one. Gamificacao nativa. UX world-class.**

## Missao

Plataforma onde criadores de conteudo criam comunidades pagas ou gratuitas com feed, cursos em video, gamificacao, eventos, e pagamentos integrados. Substituir o combo Discord+Hotmart+Zoom com experiencia unificada.

---

## Navegacao

| Secao | Descricao |
|---|---|
| [[01 - Produto/Visao do Produto\|Visao do Produto]] | Problema, solucao, diferenciais, modelo de negocio |
| [[01 - Produto/Personas e ICP\|Personas e ICP]] | Perfil de cliente ideal e personas-chave |
| [[01 - Produto/Glossario\|Glossario]] | Vocabulario padrao do dominio PortalHub |
| [[02 - Arquitetura/Visao Geral\|Arquitetura — Visao Geral]] | Stack, diagrama, decisoes de alto nivel |
| [[03 - Modelo de Dominio/Organization\|Organization]] | Community boundary, memberships, roles |
| [[03 - Modelo de Dominio/Post\|Post]] | Feed, comments, reactions |
| [[03 - Modelo de Dominio/Course\|Course]] | Cursos, modulos, aulas, progress |
| [[03 - Modelo de Dominio/Gamification\|Gamification]] | Pontos, niveis, achievements, leaderboard |
| [[04 - Design/Design System\|Design System]] | Tokens, tipografia, motion, componentes |
| [[05 - Funcionalidades]] | Features detalhadas e specs |
| [[06 - Features]] | Fases de implementacao |
| [[07 - Decisoes]] | ADRs — Architecture Decision Records |
| [[07 - Decisoes/ADR-001-stack-nextjs-supabase\|ADR-001]] | Stack: Next.js + Supabase |
| [[08 - Backlog/Master Plan\|Master Plan]] | Timeline, sprints, estimativas |
| [[08 - Backlog/Roadmap\|Roadmap]] | MVP, v2, v3 |
| [[09 - Referencias]] | Benchmarks, inspiracoes, links externos |
| [[10 - Operacional]] | Deploy, CI/CD, runbooks |

---

## Status Atual

**Fase:** ✅ MVP COMPLETO. Todas 8 sprints entregues.
**Stack:** Next.js 16 + React 19 + Supabase + Stripe + Tailwind 4 + shadcn/ui (ADR-001).
**MVP:** 8 sprints / 16 semanas / ~534h estimadas.
**Agentes:** 3 configurados (Engenheiro, Dev Senior, Dev Pleno).
**Decisoes:** 9 registradas em STATE.md (D001-D009). 1 ADR formal.
**Proximo passo:** Launch — seguir [[10 - Operacional/Launch Checklist]].

---

## Estrutura do Vault

```
PortalHub-dir/
├── 00 - Indice.md              ← voce esta aqui
├── 01 - Produto/
│   ├── Visao do Produto.md
│   ├── Personas e ICP.md
│   └── Glossario.md
├── 02 - Arquitetura/
│   └── Visao Geral.md
├── 03 - Modelo de Dominio/
│   ├── Organization.md
│   ├── Post.md
│   ├── Course.md
│   └── Gamification.md
├── 04 - Design/
│   └── Design System.md
├── 05 - Funcionalidades/
├── 06 - Features/
├── 07 - Decisoes/
│   └── ADR-001-stack-nextjs-supabase.md
├── 08 - Backlog/
│   ├── Master Plan.md
│   └── Roadmap.md
├── 09 - Referencias/
├── 10 - Operacional/
└── Agentes/
    ├── Engenheiro.md
    ├── Dev Senior.md
    └── Dev Pleno.md
```

---

## Time de Agentes

| Agente | Skill | Funcao |
|--------|-------|--------|
| [[Agentes/Engenheiro\|Engenheiro-Chefe]] | `ph-engenheiro` | Orquestra construcao, decompoe tarefas, valida arquitetura |
| [[Agentes/Dev Senior\|Dev Senior]] | `ph-dev-senior` | Decisoes tecnicas, code review, seguranca, poder de veto |
| [[Agentes/Dev Pleno\|Dev Pleno]] | `ph-dev-pleno` | Executa codigo: Next.js, React, SQL, testes |

**Fluxo:** Tarefa → Engenheiro (triage) → Dev Pleno (execucao) → Dev Senior (review) → Documentacao
