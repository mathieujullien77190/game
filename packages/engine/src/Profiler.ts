export type ProfileStat = { label: string; avgMs: number; pct: number }

const WINDOW = 60

class ProfilerImpl {
  enabled = false
  private now: () => number = () => Date.now()
  private samples = new Map<string, number[]>()
  private starts = new Map<string, number>()

  setClock = (now: () => number) => {
    this.now = now
  }

  setEnabled = (enabled: boolean) => {
    this.enabled = enabled
  }

  reset = () => {
    this.samples.clear()
    this.starts.clear()
  }

  start = (label: string) => {
    if (!this.enabled) return
    this.starts.set(label, this.now())
  }

  end = (label: string) => {
    if (!this.enabled) return
    const t0 = this.starts.get(label)
    if (t0 === undefined) return
    const dt = this.now() - t0
    let arr = this.samples.get(label)
    if (!arr) {
      arr = []
      this.samples.set(label, arr)
    }
    arr.push(dt)
    if (arr.length > WINDOW) arr.shift()
  }

  getStats = (): ProfileStat[] => {
    const rows = Array.from(this.samples.entries()).map(([label, arr]) => ({
      label,
      avgMs: arr.reduce((a, b) => a + b, 0) / arr.length,
    }))
    const total = rows.reduce((sum, r) => sum + r.avgMs, 0)
    return rows
      .map((r) => ({ ...r, pct: total > 0 ? (r.avgMs / total) * 100 : 0 }))
      .sort((a, b) => b.avgMs - a.avgMs)
  }
}

export const Profiler = new ProfilerImpl()
