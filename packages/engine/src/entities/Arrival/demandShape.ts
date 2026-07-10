import type { Renderer } from "../../render/Renderer"

export const traceDemandShape = (ctx: Renderer, x: number, y: number, type: string, angled: boolean, r = 8) => {
  if (type === "square") {
    ctx.save()
    ctx.translate(x, y)
    if (angled) ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.roundRect(-r, -r, r * 2, r * 2, r * 0.375)
    ctx.restore()
  } else {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
  }
}
