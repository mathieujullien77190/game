import { createIdCounter } from "../idCounter"

export type TokenConfig = { id: string; color: string; type: string; speed: number }

const startIds = createIdCounter("start")

export const syncStartCounter = (ids: string[]) => startIds.sync(ids)

export class Start {
  id: string
  lineId: string
  endpoint: "start" | "end"
  delay: number
  firstDelay: number
  screenId: string = "main"
  tokens: TokenConfig[] = []

  constructor(lineId: string, endpoint: "start" | "end", delay: number = 6, id?: string, screenId?: string, firstDelay?: number, tokens: TokenConfig[] = []) {
    this.id = id ?? startIds.next()
    this.lineId = lineId
    this.endpoint = endpoint
    this.delay = delay
    this.firstDelay = firstDelay ?? 2
    if (screenId) this.screenId = screenId
    this.tokens = tokens
  }
}
