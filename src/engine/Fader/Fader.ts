let faderCounter = 0

export const syncFaderCounter = (ids: string[]) => {
  let max = 0
  for (const id of ids) {
    const m = id.match(/^fader(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]))
  }
  faderCounter = max
}

const generateFaderId = () => `fader${++faderCounter}`

export class Fader {
  id: string
  linkId: string
  amount: number
  constructor(linkId: string, id?: string, amount = 0.5) {
    this.id = id ?? generateFaderId()
    this.linkId = linkId
    this.amount = amount
  }
}
