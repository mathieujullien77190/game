import {
  Skia,
  PaintStyle,
  StrokeCap,
  ClipOp,
  BlendMode,
  FontStyle,
  type SkCanvas,
  type SkPaint,
  type SkPath,
  type SkFont,
  type SkTypeface,
} from "@shopify/react-native-skia"
import type { Renderer } from "@drift/engine/render/Renderer"

// Adaptateur : implémente l'interface `Renderer` de l'engine au-dessus d'un SkCanvas
// (react-native-skia). Émule le modèle stateful de Canvas 2D (path courant, styles,
// pile de transformations) que l'engine attend. Aucun draw dupliqué : l'engine appelle
// exactement les mêmes méthodes que sur le web.

type Affine = [number, number, number, number, number, number] // a,b,c,d,e,f

const IDENT: Affine = [1, 0, 0, 1, 0, 0]

// M = A ∘ B (A appliqué après B), convention canvas (m_new = m * t).
const mul = (A: Affine, B: Affine): Affine => [
  A[0] * B[0] + A[2] * B[1],
  A[1] * B[0] + A[3] * B[1],
  A[0] * B[2] + A[2] * B[3],
  A[1] * B[2] + A[3] * B[3],
  A[0] * B[4] + A[2] * B[5] + A[4],
  A[1] * B[4] + A[3] * B[5] + A[5],
]

const inverse = (m: Affine): Affine => {
  const [a, b, c, d, e, f] = m
  const det = a * d - b * c || 1e-8
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det]
}

// Affine canvas → matrice Skia 3x3 row-major.
const toSkia = (m: Affine): number[] => [m[0], m[2], m[4], m[1], m[3], m[5], 0, 0, 1]

const CAP: Record<Renderer["lineCap"], StrokeCap> = {
  butt: StrokeCap.Butt,
  round: StrokeCap.Round,
  square: StrokeCap.Square,
}

type StyleSnapshot = Pick<
  SkiaRenderer,
  "fillStyle" | "strokeStyle" | "lineWidth" | "lineCap" | "globalAlpha" | "font" | "textAlign" | "textBaseline" | "shadowBlur" | "shadowColor"
> & { lineDash: number[] }

export class SkiaRenderer implements Renderer {
  // état exposé (interface Renderer)
  fillStyle = "#000000"
  strokeStyle = "#000000"
  lineWidth = 1
  lineCap: Renderer["lineCap"] = "butt"
  globalAlpha = 1
  font = "10px sans-serif"
  textAlign: Renderer["textAlign"] = "start"
  textBaseline: Renderer["textBaseline"] = "alphabetic"
  shadowBlur = 0
  shadowColor = "#000000"
  readonly canvas: { readonly width: number; readonly height: number }

  private sk: SkCanvas
  private path: SkPath = Skia.Path.Make()
  // Paints réutilisés (mutés à chaque fill/stroke) au lieu d'allouer un Skia.Paint()
  // par draw call — l'engine dessine des dizaines de paths par frame.
  private readonly _fill: SkPaint = Skia.Paint()
  private readonly _stroke: SkPaint = Skia.Paint()
  private lineDash: number[] = []
  private m: Affine = [...IDENT]
  private mStack: Affine[] = []
  private styleStack: StyleSnapshot[] = []
  private fontCache = new Map<number, SkFont>()

  constructor(canvas: SkCanvas, width: number, height: number) {
    this.sk = canvas
    this.canvas = { width, height }
  }

  // --- paints ---
  private fillPaint(): SkPaint {
    const p = this._fill
    p.setAntiAlias(true)
    p.setStyle(PaintStyle.Fill)
    p.setColor(Skia.Color(this.fillStyle))
    p.setAlphaf(this.globalAlpha) // toujours reset (paint réutilisé)
    return p
  }

  private strokePaint(): SkPaint {
    const p = this._stroke
    p.setAntiAlias(true)
    p.setStyle(PaintStyle.Stroke)
    p.setColor(Skia.Color(this.strokeStyle))
    p.setAlphaf(this.globalAlpha)
    p.setStrokeWidth(this.lineWidth)
    p.setStrokeCap(CAP[this.lineCap])
    p.setPathEffect(this.lineDash.length ? Skia.PathEffect.MakeDash(this.lineDash) : null)
    return p
  }

  // Typeface système résolue une seule fois (partagée : l'app recrée un SkiaRenderer
  // par frame). `Skia.Font()` sans typeface ne dessine AUCUN glyphe → il faut une vraie
  // typeface du FontMgr système, sinon fillText est invisible.
  private static typeface: SkTypeface | null | undefined
  private static getTypeface(): SkTypeface | null {
    if (SkiaRenderer.typeface !== undefined) return SkiaRenderer.typeface
    try {
      const mgr = Skia.FontMgr.System()
      let tf: SkTypeface | null = mgr.matchFamilyStyle("monospace", FontStyle.Normal)
      if (!tf && mgr.countFamilies() > 0) tf = mgr.matchFamilyStyle(mgr.getFamilyName(0), FontStyle.Normal)
      SkiaRenderer.typeface = tf ?? null
    } catch {
      SkiaRenderer.typeface = null
    }
    return SkiaRenderer.typeface
  }

  private getFont(): SkFont {
    const size = parseInt(/(\d+)px/.exec(this.font)?.[1] ?? "10", 10)
    let f = this.fontCache.get(size)
    if (!f) {
      const tf = SkiaRenderer.getTypeface()
      // Ne pas passer `undefined` comme typeface (le binding JSI Skia 2.x lève
      // "Value is undefined, expected an Object").
      f = tf ? Skia.Font(tf, size) : Skia.Font()
      f.setSize(size)
      this.fontCache.set(size, f)
    }
    return f
  }

  // --- path ---
  beginPath(): void {
    this.path = Skia.Path.Make()
  }
  closePath(): void {
    this.path.close()
  }
  moveTo(x: number, y: number): void {
    this.path.moveTo(x, y)
  }
  lineTo(x: number, y: number): void {
    this.path.lineTo(x, y)
  }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.path.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
  }
  rect(x: number, y: number, w: number, h: number): void {
    this.path.addRect(Skia.XYWHRect(x, y, w, h))
  }
  roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void {
    const r = typeof radii === "number" ? radii : Array.isArray(radii) ? radii[0] ?? 0 : 0
    this.path.addRRect(Skia.RRectXY(Skia.XYWHRect(x, y, w, h), r, r))
  }
  arc(x: number, y: number, r: number, start: number, end: number, ccw = false): void {
    const TAU = Math.PI * 2
    let sweep = end - start
    if (ccw) { if (sweep > 0) sweep -= TAU } else if (sweep < 0) sweep += TAU
    if (Math.abs(sweep) >= TAU - 1e-6) {
      this.path.addCircle(x, y, r)
      return
    }
    const oval = Skia.XYWHRect(x - r, y - r, r * 2, r * 2)
    this.path.addArc(oval, (start * 180) / Math.PI, (sweep * 180) / Math.PI)
  }

  // --- fills / strokes ---
  fill(): void {
    this.sk.drawPath(this.path, this.fillPaint())
  }
  stroke(): void {
    this.sk.drawPath(this.path, this.strokePaint())
  }
  clip(): void {
    this.sk.clipPath(this.path, ClipOp.Intersect, true)
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    const p = Skia.Path.Make()
    p.addRect(Skia.XYWHRect(x, y, w, h))
    this.sk.drawPath(p, this.fillPaint())
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    const p = Skia.Path.Make()
    p.addRect(Skia.XYWHRect(x, y, w, h))
    const paint = Skia.Paint()
    paint.setColor(Skia.Color("#00000000"))
    paint.setBlendMode(BlendMode.Clear)
    this.sk.drawPath(p, paint)
  }
  fillText(text: string, x: number, y: number): void {
    const f = this.getFont()
    const [dx, dy] = this.textOffset(text, f)
    this.sk.drawText(text, x + dx, y + dy, this.fillPaint(), f)
  }
  setLineDash(segments: number[]): void {
    this.lineDash = segments
  }

  private textOffset(text: string, f: SkFont): [number, number] {
    let dx = 0
    if (this.textAlign === "center") dx = -f.getTextWidth(text) / 2
    else if (this.textAlign === "right" || this.textAlign === "end") dx = -f.getTextWidth(text)
    let dy = 0
    const mt = f.getMetrics()
    if (this.textBaseline === "top" || this.textBaseline === "hanging") dy = -mt.ascent
    else if (this.textBaseline === "middle") dy = -(mt.ascent + mt.descent) / 2
    else if (this.textBaseline === "bottom" || this.textBaseline === "ideographic") dy = -mt.descent
    return [dx, dy]
  }

  // --- transformations ---
  save(): void {
    this.sk.save()
    this.mStack.push([...this.m])
    this.styleStack.push(this.snapshot())
  }
  restore(): void {
    this.sk.restore()
    const m = this.mStack.pop()
    if (m) this.m = m
    const s = this.styleStack.pop()
    if (s) this.applySnapshot(s)
  }
  translate(x: number, y: number): void {
    this.sk.translate(x, y)
    this.m = mul(this.m, [1, 0, 0, 1, x, y])
  }
  scale(x: number, y: number): void {
    this.sk.scale(x, y)
    this.m = mul(this.m, [x, 0, 0, y, 0, 0])
  }
  rotate(a: number): void {
    this.sk.rotate((a * 180) / Math.PI, 0, 0)
    const cos = Math.cos(a), sin = Math.sin(a)
    this.m = mul(this.m, [cos, sin, -sin, cos, 0, 0])
  }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    const target: Affine = [a, b, c, d, e, f]
    const delta = mul(inverse(this.m), target) // this.m * delta = target
    this.sk.concat(toSkia(delta))
    this.m = target
  }

  private snapshot(): StyleSnapshot {
    return {
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      lineCap: this.lineCap,
      globalAlpha: this.globalAlpha,
      font: this.font,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      lineDash: [...this.lineDash],
    }
  }
  private applySnapshot(s: StyleSnapshot): void {
    this.fillStyle = s.fillStyle
    this.strokeStyle = s.strokeStyle
    this.lineWidth = s.lineWidth
    this.lineCap = s.lineCap
    this.globalAlpha = s.globalAlpha
    this.font = s.font
    this.textAlign = s.textAlign
    this.textBaseline = s.textBaseline
    this.shadowBlur = s.shadowBlur
    this.shadowColor = s.shadowColor
    this.lineDash = s.lineDash
  }
}
