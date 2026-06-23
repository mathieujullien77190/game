let startCounter = 1

export const syncStartCounter = (ids: string[]) => {
  const max = ids.reduce((m, id) => {
    const n = parseInt(id.replace("start", ""))
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  if (max >= startCounter) startCounter = max + 1
}

export class Start {
  id: string
  lineId: string
  endpoint: "start" | "end"
  delay: number

  constructor(lineId: string, endpoint: "start" | "end", delay: number = 2, id?: string) {
    this.id = id ?? `start${startCounter++}`
    this.lineId = lineId
    this.endpoint = endpoint
    this.delay = delay
  }
}
