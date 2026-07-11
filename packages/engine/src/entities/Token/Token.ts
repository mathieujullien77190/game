import { createIdCounter } from "../idCounter"

const tokenIds = createIdCounter("token")

export const syncTokenCounter = (ids: string[]) => tokenIds.sync(ids)

export type TokenType = "round" | "square" | "cop" | "triangle"

// Label affiché pour l'état "angled" de chaque type ayant une orientation alternative
// (carré : symétrie 4, 90°/2 = 45° ; triangle : symétrie 3, 120°/2 = 60°). Absent des types
// sans état angled (round, cop) — voir period()/ANGLED_LABEL dans TokenPreview.ts.
export const ANGLED_LABEL: Partial<Record<TokenType, string>> = { square: "45°", triangle: "60°" }

// Glyphe affiché pour chaque forme dans les sélecteurs (StartTab, ArrivalTab, TransformerTab),
// seule source de vérité pour rester visuellement cohérent partout où une forme se choisit.
export const TYPE_GLYPH: Partial<Record<TokenType, string>> = { round: "●", square: "■", triangle: "▲" }

export const TOKEN_COLORS = [
  "#e53935",
  "#fb8c00",
  "#fdd835",
  "#43a047",
  "#00acc1",
  "#1a73e8",
  "#8e24aa",
  "#e91e63",
  "#546e7a",
  "#ffcdd2",
  "#ffe0b2",
  "#fff59d",
  "#a5d6a7",
  "#b2ebf2",
  "#90caf9",
  "#ce93d8",
  "#f8bbd0",
  "#cfd8dc",
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
