// Entrée web du jeu, chargée DANS la WebView de l'app RN.
// Fait tourner la version *preview* de l'engine en canvas2d (le renderer prouvé rapide
// sur mobile). La map est injectée par RN dans `window.__DRIFT_MAP__` avant le chargement
// (injectedJavaScriptBeforeContentLoaded) → pas besoin de rebuild ce bundle quand la map change.
// Réplique la logique de edition/hooks/useCanvasDrawPreview, sans React.

import { buildPreviewManager } from "@drift/engine/Map/loadPreview"
import type { MapJson } from "@drift/engine/Map/mapJson"
import { CANVAS_W, CANVAS_H } from "@drift/engine/constants"
import { Canvas2DRenderer, applyScreenEffects } from "@drift/canvas-render"

declare global {
  interface Window {
    __DRIFT_MAP__?: MapJson
  }
}

const canvas = document.getElementById("c") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!

const map = window.__DRIFT_MAP__
if (!map) throw new Error("window.__DRIFT_MAP__ manquant (injection RN absente)")
const pm = buildPreviewManager(map)

let scale = 1
let offX = 0
let offY = 0
let dpr = 1

const resize = () => {
  dpr = window.devicePixelRatio || 1
  const vw = window.innerWidth
  const vh = window.innerHeight
  scale = Math.min(vw / CANVAS_W, vh / CANVAS_H)
  offX = (vw - CANVAS_W * scale) / 2
  offY = (vh - CANVAS_H * scale) / 2
  canvas.width = Math.round(vw * dpr)
  canvas.height = Math.round(vh * dpr)
  canvas.style.width = vw + "px"
  canvas.style.height = vh + "px"
}
resize()
window.addEventListener("resize", resize)

const loop = (t: number) => {
  // base transform = dpr * translate(offset) * scale(fit) ; drawAllPreview efface + fond blanc en interne.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.translate(offX, offY)
  ctx.scale(scale, scale)
  pm.tickSim(t)
  pm.drawAllPreview(new Canvas2DRenderer(ctx))
  applyScreenEffects(ctx, pm)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// Clic → coords logiques (CANVAS_W/H) → clickAt (switches, retour mini-map, etc).
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left - offX) / scale
  const y = (e.clientY - rect.top - offY) / scale
  pm.clickAt(x, y)
})
