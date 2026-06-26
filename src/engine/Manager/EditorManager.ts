import type { Point } from "../types"
import { CANVAS_H, CANVAS_W, GRID_MAJOR, GRID_MINOR } from "../constants"
import { LineEditor } from "../Line/LineEditor"
import { Link } from "../Link/Link"
import { StartEditor } from "../Start/StartEditor"
import { SwitchEditor } from "../Switch/SwitchEditor"
import { getSwitchEnterPoint } from "../Switch/switchUtils"
import { InverterEditor } from "../Inverter/InverterEditor"
import { TransformerEditor } from "../Transformer/TransformerEditor"
import type { TransformerType } from "../Transformer/Transformer"
import { ArrivalEditor } from "../Arrival/ArrivalEditor"
import { ScreenGateEditor } from "../ScreenGate/ScreenGateEditor"
import { drawStats } from "../stats"
import { Manager } from "./Manager"

const pointsEqual = (a: Point, b: Point) => a.x === b.x && a.y === b.y

export class EditorManager extends Manager<LineEditor> {
  data = {
    lines: {} as Record<string, LineEditor>,
    links: {} as Record<string, Link>,
  }

  addLine = (line: LineEditor) => {
    for (const existing of Object.values(this.data.lines)) {
      if (existing.screenId !== line.screenId) continue
      for (const ep1 of ["start", "end"] as const) {
        for (const ep2 of ["start", "end"] as const) {
          if (pointsEqual(existing[ep1], line[ep2])) {
            const link = new Link(
              { lineId: existing.id, endpoint: ep1 },
              { lineId: line.id, endpoint: ep2 }
            )
            this.data.links[link.id] = link
          }
        }
      }
    }
    this.data.lines[line.id] = line
  }

  removeLine = (id: string) => {
    delete this.data.lines[id]
    for (const linkId of Object.keys(this.data.links)) {
      const link = this.data.links[linkId]
      if (link.line1.lineId === id || link.line2.lineId === id) {
        delete this.data.links[linkId]
      }
    }
  }

  refreshLinksForEndpoint = (lineId: string, endpoint: "start" | "end") => {
    for (const linkId of Object.keys(this.data.links)) {
      const link = this.data.links[linkId]
      if (
        (link.line1.lineId === lineId && link.line1.endpoint === endpoint) ||
        (link.line2.lineId === lineId && link.line2.endpoint === endpoint)
      ) {
        delete this.data.links[linkId]
      }
    }
    const movedLine = this.data.lines[lineId]
    if (!movedLine) return
    const movedPoint = movedLine[endpoint]
    for (const other of Object.values(this.data.lines)) {
      if (other.id === lineId) continue
      if (other.screenId !== movedLine.screenId) continue
      for (const ep of ["start", "end"] as const) {
        if (pointsEqual(movedPoint, other[ep])) {
          const link = new Link(
            { lineId, endpoint },
            { lineId: other.id, endpoint: ep }
          )
          this.data.links[link.id] = link
        }
      }
    }
  }

  drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.setLineDash([])

    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1
    for (let x = 0; x <= CANVAS_W; x += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(CANVAS_W, y + 0.5); ctx.stroke()
    }

    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    for (let x = 0; x <= CANVAS_W; x += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(CANVAS_W, y + 0.5); ctx.stroke()
    }
  }

  drawAll = (
    ctx: CanvasRenderingContext2D,
    hoveredLineId: string | null = null,
    snapPoint: Point | null = null,
    pendingPoint: Point | null = null,
    showIds = false,
    starts: StartEditor[] = [],
    switches: SwitchEditor[] = [],
    previewStartPt: Point | null = null,
    previewSwitchPt: Point | null = null,
    fps = 0,
    frameMs = 0,
    hoveredSwitchId: string | null = null,
    transformers: TransformerEditor[] = [],
    hoveredTransformerId: string | null = null,
    previewTransformerPt: Point | null = null,
    previewTransformerType: TransformerType | null = null,
    inverters: InverterEditor[] = [],
    hoveredInverterId: string | null = null,
    previewInverterPt: Point | null = null,
    arrival: ArrivalEditor | null = null,
    previewArrivalPt: Point | null = null,
    screenGates: ScreenGateEditor[] = [],
    hoveredScreenGateId: string | null = null,
    previewScreenGatePt: Point | null = null,
    screenGateMarkers: { entryKey: string; exitKey: string }[] = [],
    visibleLineIds?: Set<string>
  ) => {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()

    this.drawGrid(ctx)

    for (const sw of switches) {
      const ep = getSwitchEnterPoint(sw.linkIds, this.data.links)
      if (!ep) continue
      const line = this.data.lines[ep.lineId]
      if (!line) continue
      const pt = ep.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredSwitchId === sw.id ? 1 : 0.4
      sw.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewSwitchPt) {
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#7c3aed"
      ctx.beginPath()
      ctx.arc(previewSwitchPt.x, previewSwitchPt.y, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    for (const inv of inverters) {
      const link = this.data.links[inv.linkId]
      if (!link) continue
      const line = this.data.lines[link.line1.lineId]
      if (!line) continue
      const isEnd = link.line1.endpoint === "end"
      const pt = isEnd ? line.end : line.start
      const angle = Math.atan2(line.end.y - line.start.y, line.end.x - line.start.x)
      ctx.globalAlpha = hoveredInverterId === inv.id ? 1 : 0.4
      inv.draw(ctx, pt, angle)
      ctx.globalAlpha = 1
    }

    for (const tr of transformers) {
      const link = this.data.links[tr.linkId]
      if (!link) continue
      const line = this.data.lines[link.line1.lineId]
      if (!line) continue
      const pt = link.line1.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredTransformerId === tr.id ? 1 : 0.4
      tr.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewTransformerPt) {
      const typeColors: Record<string, string> = { fade: "#546e7a", rotate: "#00ACC1", color: "#7B1FA2", shape: "#2e7d32" }
      ctx.globalAlpha = 0.45
      ctx.fillStyle = typeColors[previewTransformerType ?? ""] ?? "#888"
      ctx.beginPath()
      ctx.arc(previewTransformerPt.x, previewTransformerPt.y, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    if (previewInverterPt) {
      ctx.globalAlpha = 0.45
      ctx.strokeStyle = "#7b1fa2"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(previewInverterPt.x - 14, previewInverterPt.y)
      ctx.lineTo(previewInverterPt.x + 14, previewInverterPt.y)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    for (const line of Object.values(this.data.lines)) {
      if (visibleLineIds && !visibleLineIds.has(line.id)) continue
      line.draw(ctx, line.id === hoveredLineId, showIds)
    }

    for (const { entryKey, exitKey } of screenGateMarkers) {
      if (entryKey) {
        const [eLineId, eEp] = entryKey.split("::")
        const eLine = this.data.lines[eLineId]
        if (eLine) {
          const pt = eEp === "end" ? eLine.end : eLine.start
          ctx.fillStyle = "#000"
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (exitKey) {
        const [xLineId, xEp] = exitKey.split("::")
        const xLine = this.data.lines[xLineId]
        if (xLine) {
          const pt = xEp === "end" ? xLine.end : xLine.start
          ctx.strokeStyle = "#000"
          ctx.lineWidth = 2
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = "#000"
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    for (const start of starts) {
      const line = this.data.lines[start.lineId]
      if (!line) continue
      const pt = start.endpoint === "end" ? line.end : line.start
      start.draw(ctx, pt)
    }

    if (arrival) {
      const line = this.data.lines[arrival.lineId]
      if (line) {
        const pt = arrival.endpoint === "end" ? line.end : line.start
        arrival.draw(ctx, pt)
      }
    }

    if (previewArrivalPt) {
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(previewArrivalPt.x, previewArrivalPt.y, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#fff"
      ctx.fillRect(previewArrivalPt.x - 5, previewArrivalPt.y - 5, 10, 10)
      ctx.globalAlpha = 1
    }

    for (const sg of screenGates) {
      const link = this.data.links[sg.linkId]
      if (!link) continue
      const line = this.data.lines[link.line1.lineId]
      if (!line) continue
      const pt = link.line1.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredScreenGateId === sg.id ? 1 : 0.4
      sg.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewScreenGatePt) {
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(previewScreenGatePt.x - 18, previewScreenGatePt.y - 32, 36, 64, 5)
      ctx.fill()
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    if (previewStartPt) {
      ctx.globalAlpha = 0.45
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(previewStartPt.x, previewStartPt.y, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#fff"
      ctx.beginPath()
      ctx.moveTo(previewStartPt.x - 4, previewStartPt.y - 6)
      ctx.lineTo(previewStartPt.x + 8, previewStartPt.y)
      ctx.lineTo(previewStartPt.x - 4, previewStartPt.y + 6)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
    }

    if (pendingPoint && snapPoint) {
      ctx.strokeStyle = "#999"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.moveTo(pendingPoint.x, pendingPoint.y)
      ctx.lineTo(snapPoint.x, snapPoint.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (pendingPoint) {
      ctx.fillStyle = "#f9ab00"
      ctx.beginPath()
      ctx.arc(pendingPoint.x, pendingPoint.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    if (snapPoint) {
      const isSecond = pendingPoint !== null
      ctx.fillStyle = isSecond ? "#1a73e8" : "#f9ab00"
      ctx.beginPath()
      ctx.arc(snapPoint.x, snapPoint.y, isSecond ? 7 : 5, 0, Math.PI * 2)
      ctx.fill()
    }

    drawStats(ctx, fps, frameMs)
  }
}
