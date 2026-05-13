"use client"

import { motion, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/database.types"

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
  counts?: Record<string, number>
  totalCount?: number
}

const SLUG_DOT_COLOR: Record<string, string> = {
  geral: "var(--gold)",
  anuncios: "var(--gold)",
  "anúncios": "var(--gold)",
  discussao: "var(--success)",
  "discussão": "var(--success)",
  duvidas: "var(--destructive)",
  "dúvidas": "var(--destructive)",
}

function dotColor(cat: Category): string {
  const key = cat.slug?.toLowerCase().trim()
  if (key && SLUG_DOT_COLOR[key]) return SLUG_DOT_COLOR[key]
  return cat.color ?? "var(--ink-low)"
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  counts,
  totalCount,
}: CategoryFilterProps) {
  return (
    <LayoutGroup id="category-filter">
      <div className="relative flex flex-wrap items-center gap-1">
        <FilterPill
          active={selected === null}
          onClick={() => onSelect(null)}
          label="Todos"
          count={totalCount}
        />
        {categories.map((cat) => (
          <FilterPill
            key={cat.id}
            active={selected === cat.id}
            onClick={() => onSelect(cat.id)}
            label={cat.name}
            count={counts?.[cat.id]}
            dotColor={dotColor(cat)}
          />
        ))}
      </div>
    </LayoutGroup>
  )
}

interface FilterPillProps {
  active: boolean
  onClick: () => void
  label: string
  count?: number
  dotColor?: string
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  dotColor,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[12.5px] transition-colors",
        active
          ? "font-semibold text-foreground"
          : "text-ink-mid hover:text-foreground",
      )}
    >
      {active && (
        <motion.div
          layoutId="category-filter-pill"
          className="absolute inset-0 -z-10 rounded-sm bg-paper-2 ring-1 ring-border"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: active ? `0 0 6px ${dotColor}` : "none",
          }}
        />
      )}
      <span>{label}</span>
      {typeof count === "number" && (
        <span className="wf-mono ml-0.5 !text-[10px]">{count}</span>
      )}
    </button>
  )
}
