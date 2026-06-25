let screenGateCounter = 0

export const syncScreenGateCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^gate(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  screenGateCounter = max
}

const generateScreenGateId = () => `gate${++screenGateCounter}`

export class ScreenGate {
  id: string
  linkId: string
  screenId: string = "main"
  targetScreenId: string = ""
  entryKey: string = ""
  exitKey: string = ""

  constructor(linkId: string, id?: string, screenId?: string, targetScreenId = "", entryKey = "", exitKey = "") {
    this.id = id ?? generateScreenGateId()
    this.linkId = linkId
    if (screenId) this.screenId = screenId
    this.targetScreenId = targetScreenId
    this.entryKey = entryKey
    this.exitKey = exitKey
  }
}
