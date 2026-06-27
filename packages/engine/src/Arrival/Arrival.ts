import type { TokenColor, TokenType } from "../Token/Token"
import { COLOR_TOKEN_RED } from "../constants"

let arrivalCounter = 1
let demandCounter = 1

export const syncArrivalCounter = (ids: string[]) => {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.replace("arrival", ""))
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  if (max >= arrivalCounter) arrivalCounter = max + 1
}

export type Demand = {
  id: string
  color: TokenColor
  type: TokenType
  angled: boolean
}

export const makeDemand = (color: TokenColor = COLOR_TOKEN_RED, type: TokenType = "round", angled = false): Demand => ({
  id: `demand${demandCounter++}`,
  color,
  type,
  angled,
})

export class Arrival {
  id: string
  lineId: string
  endpoint: "start" | "end"
  demands: Demand[]
  screenId: string = "main"

  constructor(lineId: string, endpoint: "start" | "end", id?: string, demands: Demand[] = [], screenId?: string) {
    this.id = id ?? `arrival${arrivalCounter++}`
    this.lineId = lineId
    this.endpoint = endpoint
    this.demands = demands
    if (screenId) this.screenId = screenId
  }
}
