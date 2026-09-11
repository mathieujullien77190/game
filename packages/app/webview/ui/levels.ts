import type { MapJson } from "@tic-tac-tic/engine/Map/mapJson"
import { getProgress } from "./storage"

// Niveaux injectés avant chargement : par App.tsx (RN) ou par le plugin dev de vite.config.ts,
// dans l'ordre du manifeste packages/maps/levels.json.
declare global {
  interface Window {
    __TICTACTIC_LEVELS__?: { id: string; json: MapJson }[]
  }
}

export type Level = { id: string; file: string; json: MapJson }

export const LEVELS: Level[] = (window.__TICTACTIC_LEVELS__ ?? []).map((l, i) => ({
  id: l.id,
  file: `niv-${String(i + 1).padStart(2, "0")}`,
  json: l.json,
}))

export const doneCount = () => LEVELS.filter((l) => getProgress(l.id).done).length

// Niveau proposé par « LANCER » : le premier non terminé, sinon le premier.
export const nextLevelIndex = () => {
  const i = LEVELS.findIndex((l) => !getProgress(l.id).done)
  return i === -1 ? 0 : i
}

// Niveau qui suit `i` (-1 s'il n'y en a pas).
export const nextAfter = (i: number) => (i + 1 < LEVELS.length ? i + 1 : -1)
