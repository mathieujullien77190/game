import { T } from "theme"

export const DIFF_ACCENT: Record<string, string> = {
  Tutoriel: T.green,
  Avancé: T.blue,
  Expert: T.red,
}

export const DIFFICULTIES = ["Tutoriel", "Avancé", "Expert"] as const
export type Difficulty = (typeof DIFFICULTIES)[number]
