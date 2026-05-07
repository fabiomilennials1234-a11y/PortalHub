"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export function useOrganization(slug: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["organization", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("slug", slug)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}
