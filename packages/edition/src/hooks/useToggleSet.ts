import { useState } from "react"

export const useToggleSet = () => {
  const [ids, setIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return { has: (id: string) => ids.has(id), toggle }
}
