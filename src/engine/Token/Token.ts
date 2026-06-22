let tokenCounter = 1

export const syncTokenCounter = (ids: string[]) => {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.replace("token", ""))
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  if (max >= tokenCounter) tokenCounter = max + 1
}

export type TokenType = "round" | "square"

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
    this.id = id ?? `token${tokenCounter++}`
    this.color = color
    this.type = type
    this.speed = speed
  }
}
