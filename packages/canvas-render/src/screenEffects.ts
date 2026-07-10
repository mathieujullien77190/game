import type { PreviewManager } from "@drift/engine/Manager/PreviewManager"

// Effets plein écran (inverter / grayscale / dark) — rendu WEB (offscreen canvas,
// compositing). Appliqués après PreviewManager.drawAllPreview(). L'engine ne fournit
// que l'état (isInverted / isGrayscale / isDark). Un backend Skia refera son propre effet.

const darkCanvases = new WeakMap<PreviewManager, HTMLCanvasElement>()

export const applyScreenEffects = (ctx: CanvasRenderingContext2D, pm: PreviewManager) => {
  const d = pm.data
  const sid = d.previewScreenId

  if (d.isInverted) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = "difference"
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
  }

  if (d.isGrayscale) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = "color"
    ctx.fillStyle = "#808080"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
  }

  if (d.isDark) {
    const w = ctx.canvas.width, h = ctx.canvas.height
    let dc = darkCanvases.get(pm)
    if (!dc || dc.width !== w || dc.height !== h) {
      dc = document.createElement("canvas")
      dc.width = w
      dc.height = h
      darkCanvases.set(pm, dc)
    }
    const dctx = dc.getContext("2d")!
    dctx.clearRect(0, 0, w, h)
    dctx.fillStyle = "rgba(0,0,0,0.96)"
    dctx.fillRect(0, 0, w, h)
    dctx.globalCompositeOperation = "destination-out"
    const m = ctx.getTransform()
    dctx.setTransform(m)

    const punch = (x: number, y: number, r: number) => {
      const px = m.a * x + m.c * y + m.e
      const py = m.b * x + m.d * y + m.f
      const pr = r * m.a
      const g = dctx.createRadialGradient(px, py, 0, px, py, pr)
      g.addColorStop(0, "rgba(0,0,0,1)")
      g.addColorStop(0.6, "rgba(0,0,0,0.85)")
      g.addColorStop(1, "rgba(0,0,0,0)")
      dctx.fillStyle = g
      dctx.resetTransform()
      dctx.beginPath()
      dctx.arc(px, py, pr, 0, Math.PI * 2)
      dctx.fill()
      dctx.setTransform(m)
    }

    for (const token of d.tokens) {
      if (d.elapsedSeconds < token.startAt || token.exploding) continue
      const tLine = d.lines[token.lineId]
      const tPt = tLine?.points[token.pointIndex]
      if (tPt) punch(tPt.x, tPt.y, 50)
    }

    for (const sw of Object.values(d.switches)) {
      const pt = sw.getPoint()
      if (pt) punch(pt.x, pt.y, 40)
    }

    for (const s of d.starts) {
      const sLine = d.lines[s.lineId]
      if (sLine && sLine.screenId === sid) {
        const sPt = s.endpoint === "end" ? sLine.points[sLine.points.length - 1] : sLine.points[0]
        if (sPt) punch(sPt.x, sPt.y, 35)
      }
    }

    for (const a of d.arrivals) {
      const aLine = d.lines[a.lineId]
      if (aLine && aLine.screenId === sid) {
        const aPt = a.endpoint === "end" ? aLine.points[aLine.points.length - 1] : aLine.points[0]
        if (aPt) punch(aPt.x, aPt.y, 35)
      }
    }

    for (const tr of Object.values(d.transformers)) {
      const link = d.links[tr.linkId]
      if (!link) continue
      const tLine = d.lines[link.line1.lineId]
      if (!tLine || tLine.screenId !== sid) continue
      const pt = link.line1.endpoint === "end" ? tLine.end : tLine.start
      punch(pt.x, pt.y, 25)
    }

    for (const inv of Object.values(d.inverters)) {
      const link = d.links[inv.linkId]
      if (!link) continue
      const iLine = d.lines[link.line1.lineId]
      if (!iLine || iLine.screenId !== sid) continue
      const pt = link.line1.endpoint === "end" ? iLine.end : iLine.start
      punch(pt.x, pt.y, 25)
    }

    dctx.globalCompositeOperation = "source-over"
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(dc, 0, 0)
    ctx.restore()
  }
}
