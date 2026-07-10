let switchCounter = 1

export const syncSwitchCounter = (ids: string[]) => {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.replace("switch", ""))
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  if (max >= switchCounter) switchCounter = max + 1
}

export class Switch {
  id: string
  linkIds: string[]
  activeLinkId: string | null
  screenId: string = "main"
  color: string = "#ccc"

  constructor(id?: string, linkIds?: string[], activeLinkId?: string | null, screenId?: string, color?: string) {
    this.id = id ?? `switch${switchCounter++}`
    this.linkIds = linkIds ?? []
    this.activeLinkId = activeLinkId ?? null
    if (screenId) this.screenId = screenId
    if (color) this.color = color
  }
}
