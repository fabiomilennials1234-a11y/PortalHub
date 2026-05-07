"use client"

import { Button } from "@/components/ui/button"
import type { Category } from "@/types/database.types"

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button
        variant={selected === null ? "secondary" : "ghost"}
        size="xs"
        onClick={() => onSelect(null)}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selected === cat.id ? "secondary" : "ghost"}
          size="xs"
          onClick={() => onSelect(cat.id)}
          style={
            selected === cat.id
              ? ({
                  backgroundColor: `color-mix(in oklch, ${cat.color} 20%, transparent)`,
                  color: cat.color,
                } as React.CSSProperties)
              : undefined
          }
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          {cat.name}
        </Button>
      ))}
    </div>
  )
}
