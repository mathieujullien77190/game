import type { LinePoint, Point } from "../types"

export class Start {
  lineId: string
  endpoint: "start" | "end"
  delay: number

  constructor(lineId: string, endpoint: "start" | "end", delay: number = 0) {
    this.lineId = lineId
    this.endpoint = endpoint
    this.delay = delay
  }

  drawEditor = (ctx: CanvasRenderingContext2D, pt: Point) => {
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.moveTo(pt.x - 4, pt.y - 6)
    ctx.lineTo(pt.x + 8, pt.y)
    ctx.lineTo(pt.x - 4, pt.y + 6)
    ctx.closePath()
    ctx.fill()
  }

  drawPreview = (
    ctx: CanvasRenderingContext2D,
    pt: LinePoint,
    remainingDelay: number = 0,
    shape: string = "round",
    fromShape: string | null = null,
    morphProgress: number = 1,
    isPaused: boolean = false
  ) => {
    ctx.setLineDash([])
    ctx.lineWidth = 3
    const s = 14
    const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle

    // Morph : noir (#000) → gris (#aaa) sur 0.5 sec
    if (morphProgress < 1 && fromShape !== null && fromShape !== shape) {
      const gray = Math.round(170 * morphProgress)
      const hex = gray.toString(16).padStart(2, "0")
      const radius = fromShape === "round"
        ? (1 - morphProgress) * s   // round → square : rayon s → 0
        : morphProgress * s          // square → round : rayon 0 → s
      ctx.strokeStyle = `#${hex}${hex}${hex}`
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.roundRect(-s, -s, s * 2, s * 2, radius)
      ctx.stroke()
      ctx.restore()
      return
    }

    // Pause 1 sec : forme statique en gris
    if (isPaused) {
      this.drawShapeOutline(ctx, pt, s, angle, shape, "#aaa")
      return
    }

    // Forme sans timer
    if (remainingDelay <= 0 || this.delay === 0) {
      this.drawShapeOutline(ctx, pt, s, angle, shape, "#000")
      return
    }

    // Timer : bordure qui se remplit, se termine au point de connexion avec la ligne
    const progress = 1 - remainingDelay / this.delay

    if (shape === "square") {
      const perimeter = s * 8
      // position sur le chemin du point de connexion (face droite = 3s pour "start", face gauche = 7s pour "end")
      const connectionPos = this.endpoint === "start" ? 3 * s : 7 * s

      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)

      ctx.strokeStyle = "#ddd"
      ctx.beginPath()
      ctx.roundRect(-s, -s, s * 2, s * 2, 0)
      ctx.stroke()

      ctx.setLineDash([progress * perimeter, perimeter])
      ctx.lineDashOffset = -connectionPos
      ctx.strokeStyle = "#000"
      ctx.beginPath()
      ctx.roundRect(-s, -s, s * 2, s * 2, 0)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.lineDashOffset = 0

      ctx.restore()
    } else {
      // Arc qui part du point de connexion et se referme dessus
      ctx.strokeStyle = "#ddd"
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, s, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = "#000"
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, s, angle, angle + progress * Math.PI * 2)
      ctx.stroke()
    }
  }

  private drawShapeOutline = (
    ctx: CanvasRenderingContext2D,
    pt: LinePoint,
    s: number,
    angle: number,
    shape: string,
    strokeColor: string
  ) => {
    ctx.strokeStyle = strokeColor
    if (shape === "square") {
      ctx.save()
      ctx.translate(pt.x, pt.y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.roundRect(-s, -s, s * 2, s * 2, 0)
      ctx.stroke()
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, s, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}
