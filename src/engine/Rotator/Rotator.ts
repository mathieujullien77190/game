let rotatorCounter = 0

export const syncRotatorCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^rot(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  rotatorCounter = max
}

const generateRotatorId = () => `rot${++rotatorCounter}`

export class Rotator {
  id: string
  linkId: string
  constructor(linkId: string, id?: string) {
    this.id = id ?? generateRotatorId()
    this.linkId = linkId
  }
}
