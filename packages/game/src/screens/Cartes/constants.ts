import { T } from "theme"

export type Difficulty = "Tutorial" | "Beginner" | "Advanced" | "Expert" | "Hidden"

export const DIFFICULTIES: Difficulty[] = ["Tutorial", "Beginner", "Advanced", "Expert", "Hidden"]

export const DIFF_ACCENT: Record<Difficulty, string> = {
  Tutorial: T.green,
  Beginner: "#22aa88",
  Advanced: T.blue,
  Expert: T.red,
  Hidden: "#666",
}
