// Abstraction de rendu 2D — sous-ensemble de l'API canvas 2D réellement
// utilisé par le draw de l'engine, avec des types propres (zéro dépendance DOM).
// Le web passe son `ctx` (cast), un futur backend Skia implémentera cette interface.
// Aucun effet plein écran ici (inverter/dark) : ça reste côté renderer web.

export interface Renderer {
  // état / styles
  fillStyle: string
  strokeStyle: string
  lineWidth: number
  lineCap: "butt" | "round" | "square"
  globalAlpha: number
  font: string
  textAlign: "left" | "right" | "center" | "start" | "end"
  textBaseline: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom"
  shadowBlur: number
  shadowColor: string

  // taille de la surface (pour les fonds plein cadre)
  readonly canvas: { readonly width: number; readonly height: number }

  // path
  beginPath(): void
  closePath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void
  rect(x: number, y: number, w: number, h: number): void
  roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void

  // remplissage / trait
  fill(): void
  stroke(): void
  clip(): void
  fillRect(x: number, y: number, w: number, h: number): void
  clearRect(x: number, y: number, w: number, h: number): void
  fillText(text: string, x: number, y: number, maxWidth?: number): void
  setLineDash(segments: number[]): void

  // transformations
  save(): void
  restore(): void
  translate(x: number, y: number): void
  rotate(angle: number): void
  scale(x: number, y: number): void
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
}
