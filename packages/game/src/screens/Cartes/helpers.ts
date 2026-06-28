import { MAP_LIST } from "maps"
import type { MapResult } from "progressStore"

export const isLocked = (idx: number, results: Record<string, MapResult>): boolean => {
  if (idx === 0) return false
  return !results[MAP_LIST[idx - 1].id]
}
