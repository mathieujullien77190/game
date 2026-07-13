import type { Renderer } from "../render/Renderer"

export type AnimTime = { elapsed: number; now: number }

export interface Animation {
  draw(ctx: Renderer, t: AnimTime): void
}

// Interrupteur global de la couche animée. Toutes les entités passent par
// `runAnimations` → le mettre à `false` coupe TOUTE l'animation du jeu en un point
// (debug / perf), sans toucher au rendu statique (drawStatic / drawBefore). Piloté
// par `PreviewManager.animationsEnabled`.
let animationsEnabled = true
export const setAnimationsEnabled = (v: boolean) => { animationsEnabled = v }
export const areAnimationsEnabled = () => animationsEnabled

export const runAnimations = (animations: Animation[], ctx: Renderer, elapsed = 0) => {
  if (!animationsEnabled) return
  const t: AnimTime = { elapsed, now: Date.now() }
  for (const anim of animations) anim.draw(ctx, t)
}
