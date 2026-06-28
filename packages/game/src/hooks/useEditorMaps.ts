import { useEffect, useState } from "react"
import type { MapDef } from "maps"
import type { Difficulty } from "screens/Cartes/constants"

type IndexEntry = { id: string; file: string; difficulty?: Difficulty; star1?: number; star2?: number; star3?: number }

export const useEditorMaps = (): MapDef[] => {
  const [maps, setMaps] = useState<MapDef[]>([])

  useEffect(() => {
    fetch("/maps/_index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((entries: IndexEntry[]) => {
        setMaps(
          entries.map((e, i) => ({
            id: e.id,
            num: i + 1,
            file: e.file,
            difficulty: e.difficulty ?? "Tutorial",
            starThresholds: [e.star3 ?? 60, e.star2 ?? 120, e.star1 ?? 180] as [number, number, number],
          }))
        )
      })
      .catch(() => {})
  }, [])

  return maps
}
