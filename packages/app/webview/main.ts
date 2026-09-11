// Entrée web du jeu, chargée DANS la WebView de l'app RN.
// Fait tourner la version *preview* de l'engine en canvas2d (le renderer prouvé rapide
// sur mobile). La map est injectée par RN dans `window.__TICTACTIC_MAP__` avant le chargement
// (injectedJavaScriptBeforeContentLoaded) → pas besoin de rebuild ce bundle quand la map change.
// Réplique la logique de edition/hooks/useCanvasDrawPreview, sans React.

import { buildPreviewManager } from "@tic-tac-tic/engine/Map/loadPreview"
import type { MapJson } from "@tic-tac-tic/engine/Map/mapJson"
import { CANVAS_W, CANVAS_H } from "@tic-tac-tic/engine/constants"
import { Canvas2DRenderer, applyScreenEffects } from "@tic-tac-tic/canvas-render"

declare global {
  interface Window {
    __TICTACTIC_MAP__?: MapJson
  }
}

const canvas = document.getElementById("c") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!

const map = window.__TICTACTIC_MAP__
if (!map) throw new Error("window.__TICTACTIC_MAP__ manquant (injection RN absente)")
const pm = buildPreviewManager(map)

let scale = 1
let offX = 0
let offY = 0
let dpr = 1
let started = false

// base transform = dpr * translate(offset) * scale(fit) ; drawAllPreview efface + fond blanc en interne.
const draw = () => {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.translate(offX, offY)
  ctx.scale(scale, scale)
  pm.drawAllPreview(new Canvas2DRenderer(ctx))
  applyScreenEffects(ctx, pm)
}

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
  // Avant « Jouer » pas de boucle : redessine la frame figée (le resize efface le canvas).
  if (!started) draw()
}
resize()
window.addEventListener("resize", resize)

const loop = (t: number) => {
  pm.tickSim(t)
  draw()
  requestAnimationFrame(loop)
}

// Page d'accueil (#home dans index.html) : niveau figé flouté en fond ; « Jouer » lance la
// simulation (le 1er tickSim pose l'horloge → elapsedSeconds démarre à 0 au clic).
const home = document.getElementById("home")!
document.getElementById("play")!.addEventListener("click", () => {
  if (started) return
  started = true
  home.classList.add("hidden")
  home.addEventListener("transitionend", () => home.remove(), { once: true })
  requestAnimationFrame(loop)
})

// Clic → coords logiques (CANVAS_W/H) → clickAt (switches, retour mini-map, etc).
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left - offX) / scale
  const y = (e.clientY - rect.top - offY) / scale
  pm.clickAt(x, y)
})
