---
tags:
  - design
  - design-system
created: 2026-05-07
status: vivo
---

# Design System

Padrao world-class. Apple/Airbnb/Linear/Stripe. Dark-first. Sensibilidade cinematografica.

## Tokens

### Cores (HSL CSS Variables)

Dark-first. Light mode derivado. Todas as cores via CSS custom properties.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.625rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --muted: 240 3.7% 15.9%;
  --accent: 240 3.7% 15.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

### Brand Colors

- **Primary accent**: Indigo-500 (#6366f1) — energy, creativity
- **Success**: Emerald-500
- **Warning**: Amber-500
- **Error**: Rose-500

## Tipografia

- **Font family**: Inter (body), JetBrains Mono (code)
- **Scale**: 12/14/16/18/20/24/30/36/48/60/72
- **Line height**: 1.5 (body), 1.2 (headings)
- **Weight**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Spacing

Base unit: 4px. Scale: 0/1/2/3/4/5/6/8/10/12/16/20/24/32/40/48/64

## Border Radius

- **sm**: 0.375rem (buttons, inputs)
- **md**: 0.625rem (cards)
- **lg**: 0.875rem (modals, panels)
- **full**: 9999px (avatars, badges)

## Motion

Framer Motion. Principios:
- **Duration**: 150ms (micro), 300ms (standard), 500ms (page transitions)
- **Easing**: ease-out pra entrada, ease-in pra saida
- **Spring**: stiffness 400, damping 25 (pra drag-and-drop, celebrations)

## Componentes Base

shadcn/ui como fundação. Customizar via className + CSS variables. Nunca fork.

### Componentes Portados do v8

- LeaderboardCard (gamification)
- AchievementBadge (gamification)
- StreakCounter (gamification)
- LevelBadge (gamification)
- CelebrationEffect (gamification)
- ActivityFeed (dashboard)
