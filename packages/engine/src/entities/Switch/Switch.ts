import { createIdCounter } from "../idCounter"

const switchIds = createIdCounter("switch")

export const syncSwitchCounter = (ids: string[]) => switchIds.sync(ids)

export class Switch {
  id: string
  linkIds: string[]
  activeLinkId: string | null
  screenId: string = "main"
  color: string = "#ccc"

  constructor(id?: string, linkIds?: string[], activeLinkId?: string | null, screenId?: string, color?: string) {
    this.id = id ?? switchIds.next()
    this.linkIds = linkIds ?? []
    this.activeLinkId = activeLinkId ?? null
    if (screenId) this.screenId = screenId
    if (color) this.color = color
  }
}
