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
  screenId: string = "main"

  constructor(lineId: string, endpoint: "start" | "end", delay: number = 6, id?: string, screenId?: string) {
    this.id = id ?? `start${startCounter++}`
    this.lineId = lineId
    this.endpoint = endpoint
    this.delay = delay
    if (screenId) this.screenId = screenId
  }
}
