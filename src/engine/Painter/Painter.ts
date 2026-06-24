let painterCounter = 0

export const syncPainterCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^paint(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  painterCounter = max
}

const generatePainterId = () => `paint${++painterCounter}`

export class Painter {
  id: string
  linkId: string
  color: string
  constructor(linkId: string, color: string = "#e53935", id?: string) {
    this.id = id ?? generatePainterId()
    this.linkId = linkId
    this.color = color
  }
}
