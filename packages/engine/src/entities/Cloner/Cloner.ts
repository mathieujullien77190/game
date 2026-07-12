import { createIdCounter } from "../idCounter"

const clonerIds = createIdCounter("cloner")

export const syncClonerCounter = (ids: string[]) => clonerIds.sync(ids)

export class Cloner {
  id: string
  linkIds: string[]
  screenId: string = "main"

  constructor(id?: string, linkIds?: string[], screenId?: string) {
    this.id = id ?? clonerIds.next()
    this.linkIds = linkIds ?? []
    if (screenId) this.screenId = screenId
  }
}
