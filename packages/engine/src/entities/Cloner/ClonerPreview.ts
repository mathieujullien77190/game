import type { Renderer } from "../../render/Renderer"
import type { Link } from "../Link/Link"
import type { Point } from "../../types"
import { runAnimations, type Animation } from "../Animation"
import { orbitingDots } from "../../Utils/anim"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { getSwitchEnterPoint, curveIntersectAngle } from "../Switch/switchUtils"
import { Cloner } from "./Cloner"

// Anneau extérieur gris ; les pastilles tournent pile sur son bord.
const ORBIT_R = RADII.ring
const IDLE_DOT_R = 4
const IDLE_SPIN_SPEED = 1.2
// Durée du tour rapide au clonage — même échelle que PAINT_DURATION (Transformer "color").
export const CLONE_BURST_DURATION = 1.5
// 3 tours complets sur la durée du burst.
const FAST_SPIN_SPEED = (Math.PI * 2 * 3) / CLONE_BURST_DURATION

type LinesRef = Record<string, { points: Point[]; color: string | null }>
type LinksRef = Record<string, Link>

export class ClonerPreview extends Cloner {
  burstTimer: number = 0
  private _pt: Point | null = null
  private _allAngles: number[] = []
  private _dotAngle: number = 0

  // Déclenché par TokenPreview.transition() au moment du clonage réel.
  trigger = () => { this.burstTimer = CLONE_BURST_DURATION }

  tick = (deltaSeconds: number) => {
    if (this.burstTimer > 0) this.burstTimer = Math.max(0, this.burstTimer - deltaSeconds)
    const speed = this.burstTimer > 0 ? FAST_SPIN_SPEED : IDLE_SPIN_SPEED
    this._dotAngle += speed * deltaSeconds
  }

  prepareFrame = (lines: LinesRef, links: LinksRef) => {
    const ep = getSwitchEnterPoint(this.linkIds, links)
    if (!ep) { this._pt = null; return }
    const line = lines[ep.lineId]
    if (!line) { this._pt = null; return }
    const pt = ep.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0]
    if (!pt) { this._pt = null; return }
    this._pt = pt

    this._allAngles = []
    for (const lid of this.linkIds) {
      const link = links[lid]
      if (!link) continue
      const dest = link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
        ? link.line2
        : link.line1
      const destLine = lines[dest.lineId]
      if (!destLine || destLine.points.length === 0) continue
      const angle = curveIntersectAngle(destLine.points, dest.endpoint, pt.x, pt.y, ORBIT_R)
        ?? (dest.endpoint === "end"
          ? (destLine.points[destLine.points.length - 1].angle ?? 0) + Math.PI
          : (destLine.points[0].angle ?? 0))
      this._allAngles.push(angle)
    }
  }

  getPoint = (): Point | null => this._pt

  private drawStatic = (ctx: Renderer) => {
    const pt = this._pt
    if (!pt) return
    ctx.fillStyle = COLORS.white
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, ORBIT_R, 0, Math.PI * 2)
    ctx.fill()
  }

  // Anneau gris + N pastilles sur son bord (déphasées de 2π/n), via le mark orbital réutilisable.
  // `_dotAngle` (accumulé dans `tick`, jamais dérivé du temps absolu) tourne lentement en idle et
  // vite pendant le clonage — un changement de vitesse plutôt que de position, donc jamais de saut.
  readonly animations: Animation[] = [
    orbitingDots({
      center: () => this._pt,
      radius: ORBIT_R,
      count: () => this._allAngles.length,
      angle: () => this._dotAngle,
      color: COLORS.gray,
      dotR: IDLE_DOT_R,
      ring: { color: COLORS.grayLight, width: STROKE_WIDTHS.heavy },
    }),
  ]

  drawBefore = (ctx: Renderer) => {
    if (!this._pt) return
    this.drawStatic(ctx)
  }

  drawAfter = (ctx: Renderer) => {
    if (!this._pt) return
    runAnimations(this.animations, ctx)
  }
}
