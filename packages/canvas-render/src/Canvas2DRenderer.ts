import type { Renderer } from "@drift/engine/render/Renderer"

// Adaptateur : implémente l'interface `Renderer` de l'engine en enveloppant le
// CanvasRenderingContext2D du navigateur. Miroir web de SkiaRenderer. Délégation
// directe (Renderer est un sous-ensemble de l'API canvas 2D). Point d'extension
// pour d'éventuelles méthodes spécifiques web plus tard.

export class Canvas2DRenderer implements Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  // --- styles ---
  get fillStyle(): string { return this.ctx.fillStyle as string }
  set fillStyle(v: string) { this.ctx.fillStyle = v }
  get strokeStyle(): string { return this.ctx.strokeStyle as string }
  set strokeStyle(v: string) { this.ctx.strokeStyle = v }
  get lineWidth(): number { return this.ctx.lineWidth }
  set lineWidth(v: number) { this.ctx.lineWidth = v }
  get lineCap(): Renderer["lineCap"] { return this.ctx.lineCap }
  set lineCap(v: Renderer["lineCap"]) { this.ctx.lineCap = v }
  get globalAlpha(): number { return this.ctx.globalAlpha }
  set globalAlpha(v: number) { this.ctx.globalAlpha = v }
  get font(): string { return this.ctx.font }
  set font(v: string) { this.ctx.font = v }
  get textAlign(): Renderer["textAlign"] { return this.ctx.textAlign }
  set textAlign(v: Renderer["textAlign"]) { this.ctx.textAlign = v }
  get textBaseline(): Renderer["textBaseline"] { return this.ctx.textBaseline }
  set textBaseline(v: Renderer["textBaseline"]) { this.ctx.textBaseline = v }
  get shadowBlur(): number { return this.ctx.shadowBlur }
  set shadowBlur(v: number) { this.ctx.shadowBlur = v }
  get shadowColor(): string { return this.ctx.shadowColor }
  set shadowColor(v: string) { this.ctx.shadowColor = v }

  get canvas(): { readonly width: number; readonly height: number } { return this.ctx.canvas }

  // --- path ---
  beginPath(): void { this.ctx.beginPath() }
  closePath(): void { this.ctx.closePath() }
  moveTo(x: number, y: number): void { this.ctx.moveTo(x, y) }
  lineTo(x: number, y: number): void { this.ctx.lineTo(x, y) }
  arc(x: number, y: number, r: number, s: number, e: number, ccw?: boolean): void { this.ctx.arc(x, y, r, s, e, ccw) }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void { this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) }
  rect(x: number, y: number, w: number, h: number): void { this.ctx.rect(x, y, w, h) }
  roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void { this.ctx.roundRect(x, y, w, h, radii) }

  // --- fills / strokes ---
  fill(): void { this.ctx.fill() }
  stroke(): void { this.ctx.stroke() }
  clip(): void { this.ctx.clip() }
  fillRect(x: number, y: number, w: number, h: number): void { this.ctx.fillRect(x, y, w, h) }
  clearRect(x: number, y: number, w: number, h: number): void { this.ctx.clearRect(x, y, w, h) }
  fillText(text: string, x: number, y: number, maxWidth?: number): void { this.ctx.fillText(text, x, y, maxWidth) }
  setLineDash(segments: number[]): void { this.ctx.setLineDash(segments) }

  // --- transformations ---
  save(): void { this.ctx.save() }
  restore(): void { this.ctx.restore() }
  translate(x: number, y: number): void { this.ctx.translate(x, y) }
  rotate(a: number): void { this.ctx.rotate(a) }
  scale(x: number, y: number): void { this.ctx.scale(x, y) }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void { this.ctx.setTransform(a, b, c, d, e, f) }
}
