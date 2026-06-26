let inverterCounter = 0

export const syncInverterCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^inv(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  inverterCounter = max
}

const generateInverterId = () => `inv${++inverterCounter}`

export class Inverter {
  id: string
  linkId: string
  screenId: string = "main"
  effect: "invert" | "grayscale" = "invert"
  constructor(linkId: string, id?: string, screenId?: string) {
    this.id = id ?? generateInverterId()
    this.linkId = linkId
    if (screenId) this.screenId = screenId
  }
}
