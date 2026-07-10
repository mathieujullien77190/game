import { createIdCounter } from "../idCounter"

const inverterIds = createIdCounter("inv")

export const syncInverterCounter = (ids: string[]) => inverterIds.sync(ids)

export class Inverter {
  id: string
  linkId: string
  screenId: string = "main"
  effect: "invert" | "grayscale" | "dark" = "invert"
  constructor(linkId: string, id?: string, screenId?: string) {
    this.id = id ?? inverterIds.next()
    this.linkId = linkId
    if (screenId) this.screenId = screenId
  }
}
