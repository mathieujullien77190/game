import { createIdCounter } from "../idCounter"

export type TokenConfig = { id: string; color: string; type: string; speed: number; angled?: boolean }

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
  // Nombre de secondes (depuis le début de la simulation) au bout duquel la ligne accrochée à
  // ce start (`lineId`) commence à s'estomper — 0 = désactivé, ligne toujours pleinement
  // visible. Cf. PreviewManager.CLAUDE.md.
  fadeLineAfter: number = 0

  constructor(lineId: string, endpoint: "start" | "end", delay: number = 6, id?: string, screenId?: string, firstDelay?: number, tokens: TokenConfig[] = [], fadeLineAfter: number = 0) {
    this.id = id ?? startIds.next()
    this.lineId = lineId
    this.endpoint = endpoint
    this.delay = delay
    this.firstDelay = firstDelay ?? 2
    if (screenId) this.screenId = screenId
    this.tokens = tokens
    this.fadeLineAfter = fadeLineAfter
  }
}
