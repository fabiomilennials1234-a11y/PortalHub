---
tags:
  - produto
  - glossario
created: 2026-05-07
status: vivo
---

# Glossario

Vocabulario padrao do dominio PortalHub.

| Termo | Definicao |
|-------|-----------|
| **Community** | Grupo/organização criado por um owner. Equivale a um "grupo" no Skool. Boundary de multi-tenancy. |
| **Member** | Usuario que pertence a uma community. Tem role (owner/admin/mod/member). |
| **Feed** | Timeline de posts dentro de uma community. Ordenado por data ou popularidade. |
| **Post** | Conteudo publicado no feed. Tem titulo, body (rich text), categoria, reactions. |
| **Category** | Classificação de posts dentro do feed. Permite filtrar. Admin gerencia. |
| **Reaction** | Interação em post/comment. Tipos: like, love, insightful, fire. |
| **Course** | Conjunto de módulos com aulas. Pode ser free, paid, ou level-locked. |
| **Module** | Agrupamento de lessons dentro de um course. Ordenável por drag-and-drop. |
| **Lesson** | Unidade de conteúdo. Pode ser video (embed), texto (rich text), ou embed externo. |
| **Progress** | Tracking de completion de lessons. Percentual calculado por módulo e curso. |
| **Points** | Moeda de engajamento. Earned por ações (post, comment, lesson, reaction, login). |
| **Level** | Tier baseado em points acumulados. Configurável por community. Pode unlockar content. |
| **Achievement** | Badge earned ao atingir milestone (First Post, 7-Day Streak, Course Completer). |
| **Leaderboard** | Ranking de members por points. Filtros: weekly, monthly, all-time. |
| **Streak** | Dias consecutivos de atividade. Multiplica pontos. |
| **Plan** | Tier de assinatura da community. Free ou paid (monthly/annual). |
| **Subscription** | Relação member ↔ plan. Gerenciada via Stripe. |
| **Event** | Acontecimento agendado. Tem data, meeting URL, max attendees, RSVP. |
| **RSVP** | Confirmação de presença em event. Status: going, maybe, not_going. |
| **Report** | Denúncia de post/comment/member por violação. Vai pra moderation queue. |
| **Slug** | Identificador URL-friendly da community. Único globalmente. |
| **Owner** | Criador da community. Role máximo. Gerencia tudo. |
