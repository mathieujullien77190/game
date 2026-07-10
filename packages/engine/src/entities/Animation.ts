import type { Renderer } from "../render/Renderer"

export type AnimTime = { elapsed: number; now: number }

export interface Animation {
  draw(ctx: Renderer, t: AnimTime): void
}

export const runAnimations = (animations: Animation[], ctx: Renderer, elapsed = 0) => {
  const t: AnimTime = { elapsed, now: Date.now() }
  for (const anim of animations) anim.draw(ctx, t)
}
