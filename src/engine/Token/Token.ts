import {
  COLOR_TOKEN_RED, COLOR_TOKEN_ORANGE, COLOR_TOKEN_YELLOW, COLOR_TOKEN_GREEN,
  COLOR_TOKEN_CYAN, COLOR_TOKEN_BLUE, COLOR_TOKEN_PURPLE, COLOR_TOKEN_PINK,
  COLOR_TOKEN_SLATE, COLOR_TOKEN_DARK,
} from "../constants"

let tokenCounter = 1

export const syncTokenCounter = (ids: string[]) => {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.replace("token", ""))
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  if (max >= tokenCounter) tokenCounter = max + 1
}

export type TokenType = "round" | "square" | "cop"

export const TOKEN_COLORS = [
  COLOR_TOKEN_RED,
  COLOR_TOKEN_ORANGE,
  COLOR_TOKEN_YELLOW,
  COLOR_TOKEN_GREEN,
  COLOR_TOKEN_CYAN,
  COLOR_TOKEN_BLUE,
  COLOR_TOKEN_PURPLE,
  COLOR_TOKEN_PINK,
  COLOR_TOKEN_SLATE,
  COLOR_TOKEN_DARK,
] as const

export type TokenColor = (typeof TOKEN_COLORS)[number]

export class Token {
  id: string
  color: TokenColor
  type: TokenType
  speed: number

  constructor(color: TokenColor, speed: number, id?: string, type: TokenType = "round") {
    this.id = id ?? `token${tokenCounter++}`
    this.color = color
    this.type = type
    this.speed = speed
  }
}
