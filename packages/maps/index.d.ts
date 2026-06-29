import type { MapJson } from "../engine/src/mapJson"

export type MapIndexEntry = {
  id: string
  file: string
  difficulty: string
  star1: number
  star2: number
  star3: number
}

export const MAP_DATA: Record<string, MapJson>
export const MAP_INDEX: MapIndexEntry[]
