import type { Renderer } from "../render/Renderer"
import type { Point } from "../types"
import { CANVAS_H, CANVAS_W, GRID_MAJOR, GRID_MINOR } from "../constants"
import { LineEditor } from "../entities/Line/LineEditor"
import { Link } from "../entities/Link/Link"
import { StartEditor, drawStartShape } from "../entities/Start/StartEditor"
import { SwitchEditor, drawSwitchShape } from "../entities/Switch/SwitchEditor"
import { getSwitchEnterPoint } from "../entities/Switch/switchUtils"
import { ClonerEditor, drawClonerShape } from "../entities/Cloner/ClonerEditor"
import { InverterEditor, drawInverterShape } from "../entities/Inverter/InverterEditor"
import { TransformerEditor, TYPE_COLOR } from "../entities/Transformer/TransformerEditor"
import type { TransformerType } from "../entities/Transformer/Transformer"
import { ArrivalEditor, drawArrivalEmptyShape } from "../entities/Arrival/ArrivalEditor"
import { ScreenGateEditor, drawGateShape } from "../entities/ScreenGate/ScreenGateEditor"
import { drawStats } from "../stats"
import { COLORS, STROKE_WIDTHS, ALPHA, RADII } from "../theme"
import { pointsEqual } from "../Utils/geometry"
import { Manager } from "./Manager"

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

  drawGrid = (ctx: Renderer) => {
    ctx.setLineDash([])

    ctx.strokeStyle = COLORS.gridMinor
    ctx.lineWidth = STROKE_WIDTHS.hairline
    for (let x = 0; x <= CANVAS_W; x += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MINOR) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(CANVAS_W, y + 0.5); ctx.stroke()
    }

    ctx.strokeStyle = COLORS.gridMajor
    ctx.lineWidth = STROKE_WIDTHS.hairline
    for (let x = 0; x <= CANVAS_W; x += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_MAJOR) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(CANVAS_W, y + 0.5); ctx.stroke()
    }
  }

  drawAll = (
    ctx: Renderer,
    hoveredLineId: string | null = null,
    snapPoint: Point | null = null,
    pendingPoint: Point | null = null,
    showIds = false,
    starts: StartEditor[] = [],
    switches: SwitchEditor[] = [],
    previewStartPt: Point | null = null,
    previewSwitchPt: Point | null = null,
    fps = 0,
    hoveredSwitchId: string | null = null,
    transformers: TransformerEditor[] = [],
    hoveredTransformerId: string | null = null,
    previewTransformerPt: Point | null = null,
    previewTransformerType: TransformerType | null = null,
    inverters: InverterEditor[] = [],
    hoveredInverterId: string | null = null,
    previewInverterPt: Point | null = null,
    arrivals: ArrivalEditor[] = [],
    previewArrivalPt: Point | null = null,
    screenGates: ScreenGateEditor[] = [],
    hoveredScreenGateId: string | null = null,
    previewScreenGatePt: Point | null = null,
    screenGateMarkers: { entryKey: string; exitKey: string }[] = [],
    visibleLineIds?: Set<string>,
    hoveredStartId: string | null = null,
    hoveredArrivalId: string | null = null,
    cloners: ClonerEditor[] = [],
    hoveredClonerId: string | null = null,
    previewClonerPt: Point | null = null
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
      ctx.globalAlpha = hoveredSwitchId === sw.id ? ALPHA.hovered : ALPHA.dimmed
      sw.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewSwitchPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawSwitchShape(ctx, previewSwitchPt)
      ctx.globalAlpha = 1
    }

    for (const cl of cloners) {
      const ep = getSwitchEnterPoint(cl.linkIds, this.data.links)
      if (!ep) continue
      const line = this.data.lines[ep.lineId]
      if (!line) continue
      const pt = ep.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredClonerId === cl.id ? ALPHA.hovered : ALPHA.dimmed
      cl.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewClonerPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawClonerShape(ctx, previewClonerPt)
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
      ctx.globalAlpha = hoveredInverterId === inv.id ? ALPHA.hovered : ALPHA.dimmed
      inv.draw(ctx, pt, angle)
      ctx.globalAlpha = 1
    }

    for (const tr of transformers) {
      const link = this.data.links[tr.linkId]
      if (!link) continue
      const line = this.data.lines[link.line1.lineId]
      if (!line) continue
      const pt = link.line1.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredTransformerId === tr.id ? ALPHA.hovered : ALPHA.dimmed
      tr.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewTransformerPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      ctx.fillStyle = TYPE_COLOR[previewTransformerType ?? ""] ?? "#888"
      ctx.beginPath()
      ctx.arc(previewTransformerPt.x, previewTransformerPt.y, RADII.node, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    if (previewInverterPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawInverterShape(ctx, previewInverterPt, -Math.PI / 2)
      ctx.globalAlpha = 1
    }

    const visibleLines = Object.values(this.data.lines).filter(
      (line) => !visibleLineIds || visibleLineIds.has(line.id)
    )
    for (const line of visibleLines) line.drawPath(ctx, line.id === hoveredLineId, showIds)
    for (const line of visibleLines) line.drawEndPoint(ctx)
    for (const line of visibleLines) line.drawStartPoint(ctx)

    for (const { entryKey, exitKey } of screenGateMarkers) {
      if (entryKey) {
        const [eLineId, eEp] = entryKey.split("::")
        const eLine = this.data.lines[eLineId]
        if (eLine) {
          const pt = eEp === "end" ? eLine.end : eLine.start
          ctx.fillStyle = COLORS.black
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
          ctx.strokeStyle = COLORS.black
          ctx.lineWidth = STROKE_WIDTHS.base
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = COLORS.black
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
      ctx.globalAlpha = hoveredStartId === start.id ? ALPHA.hovered : ALPHA.dimmed
      start.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    for (const arrival of arrivals) {
      const line = this.data.lines[arrival.lineId]
      if (!line) continue
      const pt = arrival.endpoint === "end" ? line.end : line.start
      const lineAngle = (arrival.endpoint === "end" ? line.points[line.points.length - 1]?.angle : line.points[0]?.angle) ?? 0
      ctx.globalAlpha = hoveredArrivalId === arrival.id ? ALPHA.hovered : ALPHA.dimmed
      arrival.draw(ctx, pt, lineAngle)
      ctx.globalAlpha = 1
    }

    if (previewArrivalPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawArrivalEmptyShape(ctx, previewArrivalPt)
      ctx.globalAlpha = 1
    }

    for (const sg of screenGates) {
      const link = this.data.links[sg.linkId]
      if (!link) continue
      const line = this.data.lines[link.line1.lineId]
      if (!line) continue
      const pt = link.line1.endpoint === "end" ? line.end : line.start
      ctx.globalAlpha = hoveredScreenGateId === sg.id ? ALPHA.hovered : ALPHA.dimmed
      sg.draw(ctx, pt)
      ctx.globalAlpha = 1
    }

    if (previewScreenGatePt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawGateShape(ctx, previewScreenGatePt)
      ctx.globalAlpha = 1
    }

    if (previewStartPt) {
      ctx.globalAlpha = ALPHA.ghostPreview
      drawStartShape(ctx, previewStartPt)
      ctx.globalAlpha = 1
    }

    if (pendingPoint && snapPoint) {
      ctx.strokeStyle = COLORS.gray
      ctx.lineWidth = STROKE_WIDTHS.base
      ctx.lineCap = "round"
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.moveTo(pendingPoint.x, pendingPoint.y)
      ctx.lineTo(snapPoint.x, snapPoint.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    if (pendingPoint) {
      ctx.fillStyle = COLORS.amber
      ctx.beginPath()
      ctx.arc(pendingPoint.x, pendingPoint.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = COLORS.black
      ctx.lineWidth = STROKE_WIDTHS.hairline
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(pendingPoint.x, pendingPoint.y, 7, 0, Math.PI * 2)
      ctx.stroke()
    }

    if (snapPoint) {
      const isSecond = pendingPoint !== null
      ctx.fillStyle = isSecond ? COLORS.blue : COLORS.amber
      ctx.beginPath()
      ctx.arc(snapPoint.x, snapPoint.y, isSecond ? 7 : 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = COLORS.black
      ctx.lineWidth = STROKE_WIDTHS.hairline
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(snapPoint.x, snapPoint.y, isSecond ? 9 : 7, 0, Math.PI * 2)
      ctx.stroke()
    }

    drawStats(ctx, fps, 0)
  }
}
