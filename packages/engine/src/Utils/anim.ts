// Boîte à outils d'animation : sépare le SIGNAL (temps → valeur) du MARK (valeur → pixels).
// Un mark renvoie un `Animation` (cf. entities/Animation.ts), directement plaçable dans le
// tableau `animations` d'un *Preview. Pur : zéro DOM, cible l'interface `Renderer`.
import type { Renderer } from "../render/Renderer"
import type { Point } from "../types"
import type { AnimTime, Animation } from "../entities/Animation"

// --- Signaux : temps → valeur scalaire (angle, échelle…) ---
export type Signal = (t: AnimTime) => number

// Rotation régulière : angle qui croît avec le temps de simulation (rad/s).
export const spin = (speed: number, phase = 0): Signal => (t) => phase + t.elapsed * speed

// --- Marks préconfigurés : combos de rendu qui reviennent souvent ---

// Traînée d'arcs qui s'estompe derrière un point sur un cercle.
export type Trail = { color: string; segs: number; span: number; width: number }

// Le "dot qui tourne" : un disque parcourt un cercle de rayon `radius` autour de `center`,
// à l'angle fourni par le signal. Anneau de fond et traînée optionnels.
export const orbitingDot = (cfg: {
  center: () => Point | null // position résolue par le manager (closure sur l'entité)
  radius: number
  angle: Signal
  color: string
  dotR?: number
  ring?: { color: string; width: number } | null
  trail?: () => Trail | null // lit l'état de l'entité (ex. progression) à chaque frame
}): Animation => ({
  draw: (ctx: Renderer, t: AnimTime) => {
    const c = cfg.center()
    if (!c) return
    const a = cfg.angle(t)
    ctx.save()
    ctx.translate(c.x, c.y)
    ctx.setLineDash([])
    if (cfg.ring) {
      ctx.strokeStyle = cfg.ring.color
      ctx.lineWidth = cfg.ring.width
      ctx.beginPath()
      ctx.arc(0, 0, cfg.radius, 0, Math.PI * 2)
      ctx.stroke()
    }
    const tr = cfg.trail?.()
    if (tr) {
      ctx.lineWidth = tr.width
      ctx.lineCap = "butt"
      ctx.strokeStyle = tr.color
      for (let i = 0; i < tr.segs; i++) {
        const a0 = a - tr.span * (1 - i / tr.segs)
        const a1 = a - tr.span * (1 - (i + 1) / tr.segs)
        ctx.globalAlpha = (i + 1) / tr.segs
        ctx.beginPath()
        ctx.arc(0, 0, cfg.radius, a0, a1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = cfg.color
    ctx.beginPath()
    ctx.arc(Math.cos(a) * cfg.radius, Math.sin(a) * cfg.radius, cfg.dotR ?? 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  },
})
