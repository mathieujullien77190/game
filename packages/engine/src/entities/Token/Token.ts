import { createIdCounter } from "../idCounter"

const tokenIds = createIdCounter("token")

export const syncTokenCounter = (ids: string[]) => tokenIds.sync(ids)

export type TokenType = "round" | "square" | "cop" | "triangle"

// Label affiché pour l'état "angled" de chaque type ayant une orientation alternative
// (carré : symétrie 4, 90°/2 = 45° ; triangle : symétrie 3, 120°/2 = 60°). Absent des types
// sans état angled (round, cop) — voir period()/ANGLED_LABEL dans TokenPreview.ts.
export const ANGLED_LABEL: Partial<Record<TokenType, string>> = { square: "45°", triangle: "60°" }

export const TOKEN_COLORS = [
  "#e53935",
  "#fb8c00",
  "#f9ab00",
  "#43a047",
  "#00acc1",
  "#1a73e8",
  "#8e24aa",
  "#e91e63",
  "#546e7a",
  "#222222",
] as const

export type TokenColor = (typeof TOKEN_COLORS)[number]

export class Token {
  id: string
  color: TokenColor
  type: TokenType
  speed: number

  constructor(color: TokenColor, speed: number, id?: string, type: TokenType = "round") {
    this.id = id ?? tokenIds.next()
    this.color = color
    this.type = type
    this.speed = speed
  }
}
