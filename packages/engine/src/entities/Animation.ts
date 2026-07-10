import type { Renderer } from "../render/Renderer"

export type AnimTime = { elapsed: number; now: number }

export interface Animation {
  draw(ctx: Renderer, t: AnimTime): void
}
