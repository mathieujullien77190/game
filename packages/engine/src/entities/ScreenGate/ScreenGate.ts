import { createIdCounter } from "../idCounter"

const screenGateIds = createIdCounter("gate")

export const syncScreenGateCounter = (ids: string[]) => screenGateIds.sync(ids)

export class ScreenGate {
  id: string
  linkId: string
  screenId: string = "main"
  targetScreenId: string = ""
  entryKey: string = ""
  exitKey: string = ""

  constructor(linkId: string, id?: string, screenId?: string, targetScreenId = "", entryKey = "", exitKey = "") {
    this.id = id ?? screenGateIds.next()
    this.linkId = linkId
    if (screenId) this.screenId = screenId
    this.targetScreenId = targetScreenId
    this.entryKey = entryKey
    this.exitKey = exitKey
  }
}
