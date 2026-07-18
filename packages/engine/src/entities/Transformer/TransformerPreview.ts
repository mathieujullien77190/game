import type { Renderer } from "../../render/Renderer"
import type { Point } from "../../types"
import { COLORS, STROKE_WIDTHS, RADII } from "../../theme"
import { traceTriangle } from "../../Utils/geometry"
import { runAnimations, type Animation } from "../Animation"
import { orbitingDot, spin } from "../../Utils/anim"
import { Transformer } from "./Transformer"

const ORBIT_R = RADII.ring
const ARROW_R = 16

export class TransformerPreview extends Transformer {
  transformProgress: number = -1
  currentTokenColor: string = ""

  private _pt: Point | null = null

  // temps → angle du point orbital : lent en idle, 6 tours pendant la repeinte.
  private dotAngle = (elapsedSeconds: number) =>
    this.transformProgress >= 0
      ? Math.PI / 4 + this.transformProgress * Math.PI * 2 * 6
      : Math.PI / 4 + elapsedSeconds * 0.4

  // couleur de la traînée : celle du token repeint pour `color`, gris sinon.
  private trailColor = () =>
    this.type === "color" ? this.currentTokenColor || this.color : COLORS.gray

  // Le point orbital + sa traînée (types color / shape / fade), via le mark réutilisable.
  private orbitAnim = (): Animation =>
    orbitingDot({
      center: () => this._pt,
      radius: ORBIT_R,
      color: COLORS.gray,
      dotR: 4,
      ring: { color: COLORS.grayLight, width: STROKE_WIDTHS.heavy },
      angle: (t) => this.dotAngle(t.elapsed),
      trail: () =>
        this.transformProgress > 0
          ? { color: this.trailColor(), segs: 12, span: Math.PI * 0.5, width: STROKE_WIDTHS.bold }
          : null,
    })

  // Cas `rotate` : 3 flèches qui tournent en continu, pas de dot orbital ni de traînée.
  // Ne rentre pas dans un mark préconfiguré → Animation brute (l'échappatoire du système).
  private arrowsAnim = (): Animation => ({
    draw: (ctx, t) => {
      const c = this._pt
      if (!c) return
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.setLineDash([])
      ctx.strokeStyle = COLORS.grayLight
      ctx.lineWidth = STROKE_WIDTHS.heavy
      ctx.beginPath()
      ctx.arc(0, 0, ARROW_R, 0, Math.PI * 2)
      ctx.stroke()
      ctx.rotate(spin(Math.PI * 1.4)(t))
      ctx.strokeStyle = COLORS.gray
      ctx.lineWidth = STROKE_WIDTHS.transformerActive
      ctx.lineCap = "round"
      for (let i = 0; i < 3; i++) {
        const end = (i * Math.PI * 2) / 3 + Math.PI * 0.5
        const ax = ARROW_R * Math.cos(end), ay = ARROW_R * Math.sin(end)
        const backDir = end - Math.PI / 2
        const alen = 5, spread = 0.5
        ctx.beginPath()
        ctx.moveTo(ax + alen * Math.cos(backDir + spread), ay + alen * Math.sin(backDir + spread))
        ctx.lineTo(ax, ay)
        ctx.lineTo(ax + alen * Math.cos(backDir - spread), ay + alen * Math.sin(backDir - spread))
        ctx.stroke()
      }
      ctx.restore()
    },
  })

  // Construit une fois la liste d'animations selon le type (déclaré avant, donc dispo ici).
  readonly animations: Animation[] = this.type === "rotate" ? [this.arrowsAnim()] : [this.orbitAnim()]

  // Statique, dessiné SOUS les tokens : disque blanc + glyphe central. Ne dépend pas du temps.
  private drawStatic = (ctx: Renderer, lineAngle: number) => {
    const pt = this._pt
    if (!pt) return
    ctx.save()
    ctx.translate(pt.x, pt.y)
    ctx.fillStyle = COLORS.white
    ctx.beginPath()
    ctx.arc(0, 0, this.type === "rotate" ? ARROW_R : ORBIT_R, 0, Math.PI * 2)
    ctx.fill()
    if (this.type === "color") {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
    } else if (this.type === "shape") {
      ctx.fillStyle = COLORS.gray
      if (this.targetType === "square") {
        ctx.save()
        ctx.rotate(lineAngle)
        ctx.beginPath()
        ctx.roundRect(-5, -5, 10, 10, 2)
        ctx.fill()
        ctx.restore()
      } else if (this.targetType === "triangle") {
        traceTriangle(ctx, 0, 0, 7, lineAngle)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (this.type === "fade") {
      ctx.globalAlpha = this.amount
      ctx.fillStyle = COLORS.gray
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }

  // Statique, dessiné SOUS les tokens.
  drawBefore = (ctx: Renderer, pt: Point, lineAngle = 0) => {
    this._pt = pt
    this.drawStatic(ctx, lineAngle)
  }

  // Animé, dessiné AU-DESSUS des tokens : le temps arrive en paramètre (plus de _elapsed stashé).
  drawAnimation = (ctx: Renderer, pt: Point, elapsedSeconds: number) => {
    this._pt = pt
    runAnimations(this.animations, ctx, elapsedSeconds)
  }
}
