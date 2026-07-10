import type { TokenColor, TokenType } from "../Token/Token"
import { createIdCounter } from "../idCounter"

const arrivalIds = createIdCounter("arrival")
const demandIds = createIdCounter("demand")

export const syncArrivalCounter = (ids: string[]) => arrivalIds.sync(ids)

export type Demand = {
  id: string
  color: TokenColor
  type: TokenType
  angled: boolean
}

export const makeDemand = (color: TokenColor = "#e53935", type: TokenType = "round", angled = false): Demand => ({
  id: demandIds.next(),
  color,
  type,
  angled,
})

export type QueueSide = "top" | "bottom" | "left" | "right" | "hidden"

export class Arrival {
  id: string
  lineId: string
  endpoint: "start" | "end"
  demands: Demand[]
  screenId: string = "main"
  queueSide: QueueSide = "right"

  constructor(lineId: string, endpoint: "start" | "end", id?: string, demands: Demand[] = [], screenId?: string, queueSide?: QueueSide) {
    this.id = id ?? arrivalIds.next()
    this.lineId = lineId
    this.endpoint = endpoint
    this.demands = demands
    if (screenId) this.screenId = screenId
    if (queueSide) this.queueSide = queueSide
  }
}
