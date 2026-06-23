import { CANVAS_H, CANVAS_W, GRID_MAJOR, GRID_MINOR, POINT_SPACING } from "../constants"
import { LinePreview } from "../Line/LinePreview"
import type { Link, LinkEndpoint } from "../Link/Link"
import type { Start } from "../Start/Start"
import { StartPreview } from "../Start/StartPreview"
import type { Token } from "../Token/Token"
import { TokenPreview } from "../Token/TokenPreview"
import { Manager } from "./Manager"

type LinkMap = Record<string, LinkEndpoint>

export class PreviewManager extends Manager<LinePreview> {
  data = {
    lines: {} as Record<string, LinePreview>,
    tokens: [] as TokenPreview[],
    starts: [] as StartPreview[],
    links: {} as Record<string, Link>,
    linkMap: {} as LinkMap,
    elapsedSeconds: 0,
    lastTimestamp: null as number | null,
    fps: 0,
    frameMs: 0,
  }

  initSimulation = (tokens: Record<string, Token>, links: Record<string, Link>, starts: Record<string, Start>) => {
    this.data.links = links
    this.data.linkMap = {}
    this.data.elapsedSeconds = 0
    this.data.lastTimestamp = null

    for (const lk of Object.values(links)) {
      if (!lk.activated) continue
      const k1 = `${lk.line1.lineId}::${lk.line1.endpoint}`
      const k2 = `${lk.line2.lineId}::${lk.line2.endpoint}`
      this.data.linkMap[k1] = lk.line2
      this.data.linkMap[k2] = lk.line1
    }

    this.data.starts = Object.values(starts).map(
      (s) => new StartPreview(s.lineId, s.endpoint, s.delay, s.id)
    )

    this.data.tokens = this.data.starts.flatMap((start) => {
      const line = this.data.lines[start.lineId]
      if (!line) return []
      const spawnIndex = start.endpoint === "end" ? line.points.length - 1 : 0
      const direction: 1 | -1 = start.endpoint === "end" ? -1 : 1
      return Object.values(tokens).map((t, i) => {
        const token = new TokenPreview(t.color, t.speed, t.id, t.type)
        token.startId = start.id
        token.lineId = start.lineId
        token.pointIndex = spawnIndex
        token.remainder = 0
        token.direction = direction
        token.startAt = (i + 1) * start.delay
        return token
      })
    })
  }

  tickSim = (timestamp: number) => {
    if (this.data.lastTimestamp === null) {
      this.data.lastTimestamp = timestamp
      return
    }
    const deltaMs = Math.min(timestamp - this.data.lastTimestamp, 100)
    this.data.lastTimestamp = timestamp
    this.data.fps = this.data.fps * 0.9 + (1000 / deltaMs) * 0.1

    const deltaSeconds = deltaMs / 1000
    this.data.elapsedSeconds += deltaSeconds

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue
      if (token.direction === 0 || token.speed === 0) continue

      const line = this.data.lines[token.lineId]
      if (!line) continue

      let budget = token.speed * deltaSeconds + token.remainder
      const maxIndex = line.points.length - 1

      while (budget >= POINT_SPACING) {
        budget -= POINT_SPACING
        const next = token.pointIndex + token.direction
        if (next > maxIndex) {
          this.transitionToken(token, "end", budget)
          budget = 0
          break
        }
        if (next < 0) {
          this.transitionToken(token, "start", budget)
          budget = 0
          break
        }
        token.pointIndex = next
      }
      token.remainder = budget
    }
  }

  private transitionToken = (token: TokenPreview, arrivedAt: "start" | "end", excessPoints: number) => {
    const key = `${token.lineId}::${arrivedAt}`
    const other = this.data.linkMap[key]

    if (other) {
      token.lineId = other.lineId
      const newLine = this.data.lines[token.lineId]
      const newMaxIndex = newLine ? newLine.points.length - 1 : 0
      if (other.endpoint === "start") {
        token.pointIndex = 0
        token.direction = 1
      } else {
        token.pointIndex = newMaxIndex
        token.direction = -1
      }
      token.remainder = excessPoints
    } else {
      const currentLine = this.data.lines[token.lineId]
      token.pointIndex = arrivedAt === "end" ? (currentLine?.points.length ?? 1) - 1 : 0
      token.remainder = 0
      token.direction = 0
    }
  }

  drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.setLineDash([])

    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 0.5
    for (let x = 0; x <= CANVAS_W; x += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }

    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    for (let x = 0; x <= CANVAS_W; x += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }
  }

  drawAllPreview = (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
    this.drawGrid(ctx)

    for (const line of Object.values(this.data.lines)) {
      line.draw(ctx)
    }

    for (const start of this.data.starts) {
      const line = this.data.lines[start.lineId]
      if (!line) continue
      const pt = start.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
      if (!pt) continue

      const nextWaiting = this.data.tokens
        .filter((t) => t.startId === start.id && this.data.elapsedSeconds < t.startAt)
        .sort((a, b) => a.startAt - b.startAt)[0]

      if (nextWaiting) nextWaiting.draw(ctx, pt)

      const remaining = nextWaiting ? nextWaiting.startAt - this.data.elapsedSeconds : 0
      start.draw(ctx, pt, remaining)
    }

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue

      const line = this.data.lines[token.lineId]
      if (!line || line.points.length === 0) continue

      const pt = line.points[token.pointIndex]
      if (!pt) continue

      token.draw(ctx, pt)
    }

    this.drawStats(ctx)
  }

  private drawStats = (ctx: CanvasRenderingContext2D) => {
    const frameMs = Math.ceil(this.data.frameMs)
    ctx.font = "bold 11px monospace"
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"
    ctx.fillText(`${Math.round(this.data.fps)} fps  ${frameMs}ms`, 8, CANVAS_H - 8)
  }
}
