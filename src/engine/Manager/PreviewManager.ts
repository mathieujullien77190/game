import { GRID_SIZE, POINT_SPACING } from "../constants"
import { LinePreview } from "../Line/LinePreview"
import type { Link, LinkEndpoint } from "../Link/Link"
import type { Start } from "../Start/Start"
import type { Token } from "../Token/Token"
import { Manager } from "./Manager"

type TokenSimState = {
  tokenId: string
  color: string
  speed: number
  type: string
  lineId: string
  pointIndex: number
  remainder: number
  direction: 1 | -1 | 0
  startAt: number
}

type LinkMap = Record<string, LinkEndpoint>

export class PreviewManager extends Manager<LinePreview> {
  data = {
    lines: {} as Record<string, LinePreview>,
    tokenStates: [] as TokenSimState[],
    links: {} as Record<string, Link>,
    linkMap: {} as LinkMap,
    start: null as Start | null,
    elapsedSeconds: 0,
    lastTimestamp: null as number | null,
    fps: 0,
    frameMs: 0,
    nextWaitingType: null as string | null,
    morphFromShape: null as string | null,
    morphStartElapsed: -Infinity,
  }

  initSimulation = (tokens: Record<string, Token>, links: Record<string, Link>, start: Start | null = null) => {
    this.data.links = links
    this.data.linkMap = {}
    this.data.start = start
    this.data.elapsedSeconds = 0
    this.data.lastTimestamp = null

    for (const lk of Object.values(links)) {
      if (!lk.activated) continue
      const k1 = `${lk.line1.lineId}::${lk.line1.endpoint}`
      const k2 = `${lk.line2.lineId}::${lk.line2.endpoint}`
      this.data.linkMap[k1] = lk.line2
      this.data.linkMap[k2] = lk.line1
    }

    const spawnLineId = start?.lineId ?? Object.keys(this.data.lines)[0] ?? null
    const spawnEndpoint = start?.endpoint ?? "start"
    const spawnLine = spawnLineId ? this.data.lines[spawnLineId] : null
    const spawnIndex = spawnEndpoint === "end" ? (spawnLine?.points.length ?? 1) - 1 : 0
    const spawnDirection: 1 | -1 = spawnEndpoint === "end" ? -1 : 1
    const delay = start?.delay ?? 0

    this.data.tokenStates = spawnLineId
      ? Object.values(tokens).map((t, i) => ({
          tokenId: t.id,
          color: t.color,
          speed: t.speed,
          type: t.type,
          lineId: spawnLineId,
          pointIndex: spawnIndex,
          remainder: 0,
          direction: spawnDirection,
          startAt: (i + 1) * delay,
        }))
      : []

    this.data.nextWaitingType = this.data.tokenStates[0]?.type ?? null
    this.data.morphFromShape = null
    this.data.morphStartElapsed = -Infinity
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

    for (const state of this.data.tokenStates) {
      if (this.data.elapsedSeconds < state.startAt) continue
      if (state.direction === 0 || state.speed === 0) continue

      const line = this.data.lines[state.lineId]
      if (!line) continue

      let budget = state.speed * deltaSeconds + state.remainder
      const maxIndex = line.points.length - 1

      while (budget >= POINT_SPACING) {
        budget -= POINT_SPACING
        const next = state.pointIndex + state.direction
        if (next > maxIndex) {
          this.transitionToken(state, "end", budget)
          budget = 0
          break
        }
        if (next < 0) {
          this.transitionToken(state, "start", budget)
          budget = 0
          break
        }
        state.pointIndex = next
      }
      state.remainder = budget
    }
  }

  private transitionToken = (state: TokenSimState, arrivedAt: "start" | "end", excessPoints: number) => {
    const key = `${state.lineId}::${arrivedAt}`
    const other = this.data.linkMap[key]

    if (other) {
      state.lineId = other.lineId
      const newLine = this.data.lines[state.lineId]
      const newMaxIndex = newLine ? newLine.points.length - 1 : 0
      if (other.endpoint === "start") {
        state.pointIndex = 0
        state.direction = 1
      } else {
        state.pointIndex = newMaxIndex
        state.direction = -1
      }
      state.remainder = excessPoints
    } else {
      const currentLine = this.data.lines[state.lineId]
      state.pointIndex = arrivedAt === "end" ? (currentLine?.points.length ?? 1) - 1 : 0
      state.remainder = 0
      state.direction = 0
    }
  }

  drawGrid = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas
    ctx.strokeStyle = "#e8e8e8"
    ctx.lineWidth = 1
    ctx.setLineDash([])
    for (let x = 0; x <= width; x += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  drawAllPreview = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
    this.drawGrid(ctx)

    for (const line of Object.values(this.data.lines)) {
      line.draw(ctx)
    }

    const nextWaiting = this.data.tokenStates.find(s => this.data.elapsedSeconds < s.startAt)
    const minWaitingStartAt = nextWaiting?.startAt ?? Infinity

    const nextType = nextWaiting?.type ?? null
    if (nextType && nextType !== this.data.nextWaitingType) {
      this.data.morphFromShape = this.data.nextWaitingType
      this.data.morphStartElapsed = this.data.elapsedSeconds
      this.data.nextWaitingType = nextType
    }

    const morphElapsed = this.data.elapsedSeconds - this.data.morphStartElapsed
    const morphProgress = this.data.morphFromShape ? Math.min(1, morphElapsed / 0.5) : 1
    const isPaused = this.data.morphFromShape !== null && morphElapsed >= 0.5 && morphElapsed < 1.5

    for (const state of this.data.tokenStates) {
      if (this.data.elapsedSeconds < state.startAt && state.startAt !== minWaitingStartAt) continue

      const line = this.data.lines[state.lineId]
      if (!line || line.points.length === 0) continue

      const pt = line.points[state.pointIndex]
      if (!pt) continue

      ctx.fillStyle = state.color
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      if (state.type === "square") {
        const angle = state.direction === -1 ? pt.angle + Math.PI : pt.angle
        ctx.save()
        ctx.translate(pt.x, pt.y)
        ctx.rotate(angle)
        ctx.fillRect(-8, -8, 16, 16)
        ctx.strokeRect(-8, -8, 16, 16)
        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
    }

    if (this.data.start) {
      const line = this.data.lines[this.data.start.lineId]
      if (line) {
        const pt = this.data.start.endpoint === "start" ? line.points[0] : line.points[line.points.length - 1]
        if (pt) {
          const remaining = nextWaiting ? nextWaiting.startAt - this.data.elapsedSeconds : 0
          this.data.start.drawPreview(ctx, pt, remaining, this.data.nextWaitingType ?? "round", this.data.morphFromShape, morphProgress, isPaused)
        }
      }
    }

    ctx.font = "bold 11px monospace"
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"
    ctx.fillText(`${Math.round(this.data.fps)} fps  ${this.data.frameMs.toFixed(1)}ms`, 8, ctx.canvas.height - 8)
  }
}
