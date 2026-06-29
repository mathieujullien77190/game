import type { MapJson } from "engine/mapJson"
import { MAP_DATA, MAP_INDEX } from "maps-data"

export type Difficulty = "Tutorial" | "Beginner" | "Advanced" | "Expert" | "Hidden"

export type MapDef = {
  id: string
  num: number
  file: string
  difficulty: Difficulty
  starThresholds: [number, number, number] // [3★ max secs, 2★ max secs, 1★ max secs]
}

// Map JSON data + index are bundled dynamically from packages/maps via its
// index.js (Metro require.context). Add a map in the editor → it lands in
// packages/maps + _index.json → picked up on the next bundle.
export const getMapData = (file: string): MapJson | undefined => MAP_DATA[file]

export const MAP_LIST: MapDef[] = MAP_INDEX.map((e, i) => ({
  id: e.id,
  num: i + 1,
  file: e.file,
  difficulty: (e.difficulty as Difficulty) ?? "Tutorial",
  starThresholds: [e.star3 ?? 60, e.star2 ?? 120, e.star1 ?? 180],
}))

export const getMapById = (id: string): MapDef | undefined => MAP_LIST.find((m) => m.id === id)

export const getNextMap = (id: string): MapDef | undefined => {
  const idx = MAP_LIST.findIndex((m) => m.id === id)
  return idx >= 0 && idx < MAP_LIST.length - 1 ? MAP_LIST[idx + 1] : undefined
}

export const calcStars = (time: number, thresholds: [number, number, number]): 1 | 2 | 3 => {
  if (time <= thresholds[0]) return 3
  if (time <= thresholds[1]) return 2
  return 1
}

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")
  return `${m}:${s}`
}

export const renderStars = (stars: number): string => "★".repeat(stars) + "☆".repeat(3 - stars)
