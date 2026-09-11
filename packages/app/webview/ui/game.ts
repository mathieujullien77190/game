import { buildPreviewManager } from "@tic-tac-tic/engine/Map/loadPreview"
import type { PreviewManager } from "@tic-tac-tic/engine/Manager/PreviewManager"
import type { SimEvent } from "@tic-tac-tic/engine/Manager/simEvents"
import { CANVAS_W, CANVAS_H } from "@tic-tac-tic/engine/constants"
import { Canvas2DRenderer, applyScreenEffects } from "@tic-tac-tic/canvas-render"
import { $, fmtTime } from "./dom"
import { LEVELS, nextAfter } from "./levels"
import { getProgress, options, recordWin, vibrate } from "./storage"
import { tokenLabel } from "./theme"
import { currentScreen, onShow, show } from "./router"

// Écran de jeu : boucle de simulation + HUD « Calque » (compteurs, journal, barre d'état) + dialogues
// pause / victoire / échec. La victoire et l'échec sont décidés ici à partir de l'état de la
// simulation et des événements qu'elle émet (pm.drainEvents) — l'engine ne connaît pas ces notions.

type State = "running" | "paused" | "ending" | "over"
type ArrivalEvent = Extract<SimEvent, { type: "arrival" }>
type CollisionEvent = Extract<SimEvent, { type: "collision" }>
type Failure =
  | { kind: "miss"; ev: ArrivalEvent }
  | { kind: "collision"; ev: CollisionEvent }
  | { kind: "stall"; missing: number }

const LOG_LINES = 3
// Délais avant d'afficher l'issue : laisser voir le flash d'arrivée / l'explosion.
const WIN_DELAY = 700
const MISS_DELAY = 900
const COLLISION_DELAY = 1400
const STALL_DELAY = 600

const canvas = $<HTMLCanvasElement>("c")
const ctx = canvas.getContext("2d")!
const stage = $("g-stage")
const veil = $("g-veil")
const dialog = $("g-dialog")
const logEl = $("g-log")
const hud = {
  file: $("g-file"), screen: $("g-screen"), balls: $("g-balls"), total: $("g-total"),
  clock: $("g-clock"), mult: $("g-mult"), t: $("g-t"), sw: $("g-sw"), err: $("g-err"),
}

let pm: PreviewManager | null = null
let levelIndex = 0
let state: State = "over"
let raf = 0
let frozenDrawn = false
let endAt = 0
let endFn: (() => void) | null = null
let switchFlips = 0
let errors = 0
let lastScreenId = "main"
let scale = 1
let offX = 0
let offY = 0
let dpr = 1

const setText = (el: HTMLElement, v: string) => {
  if (el.textContent !== v) el.textContent = v
}

const addLog = (html: string) => {
  const p = document.createElement("p")
  p.innerHTML = html
  logEl.appendChild(p)
  while (logEl.children.length > LOG_LINES) logEl.firstElementChild?.remove()
}

const deliveries = (sim: PreviewManager) => {
  let done = 0
  let total = 0
  for (const a of sim.data.arrivals) {
    total += a.demands.length
    done += Math.min(a.currentDemandIndex, a.demands.length)
  }
  return { done, total }
}

// Plus rien ne bouge : aucune balle en attente, en mouvement, en transformation ou en train
// d'exploser. (Une balle arrivée en bout de rail sans suite reste immobile → impasse.)
const isStalled = (sim: PreviewManager) => {
  const d = sim.data
  return !d.tokens.some(
    (t) =>
      d.elapsedSeconds < t.startAt ||
      t.isTransforming ||
      t.fadingOpacity ||
      (t.exploding ? t.explosionProgress < 1 : t.direction !== 0),
  )
}

// ── rendu ──

const resize = () => {
  const r = stage.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return
  dpr = window.devicePixelRatio || 1
  const pad = 8
  scale = Math.min((r.width - pad * 2) / CANVAS_W, (r.height - pad * 2) / CANVAS_H)
  offX = (r.width - CANVAS_W * scale) / 2
  offY = (r.height - CANVAS_H * scale) / 2
  canvas.width = Math.round(r.width * dpr)
  canvas.height = Math.round(r.height * dpr)
  frozenDrawn = false
}

const draw = () => {
  if (!pm) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.translate(offX, offY)
  ctx.scale(scale, scale)
  pm.drawAllPreview(new Canvas2DRenderer(ctx))
  applyScreenEffects(ctx, pm)
}

// ── HUD ──

const updateHud = (sim: PreviewManager) => {
  const d = sim.data
  const { done, total } = deliveries(sim)
  const mult = d.screenTimeMultipliers[d.previewScreenId] ?? 1
  if (d.previewScreenId !== lastScreenId) {
    lastScreenId = d.previewScreenId
    addLog(`› vue : <b>${d.previewScreenId.toUpperCase()}</b> (temps ×${mult})`)
  }
  setText(hud.screen, d.previewScreenId.toUpperCase())
  setText(hud.balls, String(done))
  setText(hud.total, String(total))
  setText(hud.clock, fmtTime(d.elapsedSeconds))
  setText(hud.mult, `×${mult.toFixed(1)}`)
  setText(hud.t, `t ${d.elapsedSeconds.toFixed(1)} s`)
  setText(hud.sw, `AIG. ${switchFlips}`)
  setText(hud.err, `${errors} ERREUR${errors > 1 ? "S" : ""}`)
  hud.err.className = errors > 0 ? "err" : "ok"
}

// ── issue de la partie ──

const endLater = (fn: () => void, delay: number) => {
  if (state !== "running") return
  state = "ending"
  endAt = performance.now() + delay
  endFn = fn
}

const handleEvents = (sim: PreviewManager) => {
  // map sans demandes = bac à sable : les erreurs sont journalisées mais ne terminent pas la partie
  const sandbox = deliveries(sim).total === 0
  const fail = (f: Failure, delay: number) => {
    if (!sandbox) endLater(() => openFail(f), delay)
  }
  for (const ev of sim.drainEvents()) {
    if (state !== "running") continue
    if (ev.type === "arrival") {
      if (ev.ok) {
        addLog(`<span class="ok">✓</span> arrivée · ${tokenLabel(ev.tokenColor, ev.tokenType)}`)
        vibrate(20)
      } else {
        errors++
        addLog(`<span class="err">✕</span> refusée · ${tokenLabel(ev.tokenColor, ev.tokenType)}`)
        vibrate([60, 40, 60])
        fail({ kind: "miss", ev }, MISS_DELAY)
      }
    } else {
      errors++
      addLog(`<span class="err">✕</span> collision`)
      vibrate([80, 40, 80])
      fail({ kind: "collision", ev }, COLLISION_DELAY)
    }
  }
  if (state !== "running" || sandbox) return
  const { done, total } = deliveries(sim)
  if (done >= total) endLater(openWin, WIN_DELAY)
  else if (isStalled(sim)) endLater(() => openFail({ kind: "stall", missing: total - done }), STALL_DELAY)
}

// ── boucle ──

const loop = (t: number) => {
  if (currentScreen() !== "game" || !pm) {
    raf = 0
    return
  }
  raf = requestAnimationFrame(loop)
  if (state === "paused" || state === "over") {
    // simulation figée : une seule frame suffit (redessinée après un resize)
    if (!frozenDrawn) {
      draw()
      frozenDrawn = true
    }
    return
  }
  pm.tickSim(t)
  if (state === "running") handleEvents(pm)
  else pm.drainEvents()
  if (state === "ending" && endFn && performance.now() >= endAt) {
    const fn = endFn
    endFn = null
    state = "over"
    frozenDrawn = false
    fn()
  }
  updateHud(pm)
  draw()
}

const ensureLoop = () => {
  if (!raf) raf = requestAnimationFrame(loop)
}

// ── dialogues ──

const openDialog = (variant: "" | "v-ok" | "v-err", html: string) => {
  dialog.className = `dialog ${variant}`.trim()
  dialog.innerHTML = html
  veil.hidden = false
}

const closeDialog = () => {
  veil.hidden = true
  dialog.innerHTML = ""
}

const levelFile = () => LEVELS[levelIndex]?.file ?? "—"

const pause = () => {
  if (!pm || state !== "running") return
  state = "paused"
  frozenDrawn = false
  const { done, total } = deliveries(pm)
  openDialog("", `
    <div class="note">pause café</div>
    <div class="head"><b>❚❚ Pause</b><button type="button" data-act="resume" aria-label="Reprendre">✕</button></div>
    <div class="body">
      <dl class="props">
        <dt>Plan</dt><dd>${levelFile()}</dd>
        <dt>Balles livrées</dt><dd>${done} / ${total}</dd>
        <dt>Temps écoulé</dt><dd>${fmtTime(pm.data.elapsedSeconds)}</dd>
        <dt>Aiguillages basculés</dt><dd>${switchFlips}</dd>
      </dl>
      <div class="actions">
        <button class="btn" type="button" data-act="resume">▶ REPRENDRE</button>
        <button class="btn ghost" type="button" data-act="restart">↻ RECOMMENCER</button>
        <button class="btn ghost" type="button" data-act="levels">▤ NIVEAUX</button>
        <button class="btn ghost" type="button" data-act="options">⚙ OPTIONS</button>
      </div>
    </div>`)
}

const resume = () => {
  if (!pm || state !== "paused") return
  closeDialog()
  pm.data.lastTimestamp = null // pas de saut de temps après la pause
  state = "running"
}

const openWin = () => {
  if (!pm) return
  const level = LEVELS[levelIndex]
  const time = pm.data.elapsedSeconds
  const isRecord = recordWin(level.id, time)
  const best = getProgress(level.id).best ?? time
  const { total } = deliveries(pm)
  const next = nextAfter(levelIndex)
  vibrate([30, 60, 30])
  addLog(`<span class="ok">✓</span> plan validé · ${fmtTime(time)}`)
  openDialog("v-ok", `
    <div class="note">bien joué !</div>
    <div class="head"><b>✓ Plan validé</b><span>0 erreur</span></div>
    <div class="body">
      <div><div class="label">résultat</div><div class="big ok">PLAN VALIDÉ</div></div>
      <dl class="props">
        <dt>Balles livrées</dt><dd>${total} / ${total}</dd>
        <dt>Temps</dt><dd>${fmtTime(time)}</dd>
        <dt>Aiguillages basculés</dt><dd>${switchFlips}</dd>
        <dt>Meilleur temps</dt><dd>${fmtTime(best)}</dd>
      </dl>
      ${isRecord ? `<div class="stamp">NOUVEAU RECORD</div>` : ""}
    </div>
    <div class="foot">
      <button class="btn ghost" type="button" data-act="restart">↻ REJOUER</button>
      ${next !== -1
        ? `<button class="btn" type="button" data-act="next">SUIVANT ▶</button>`
        : `<button class="btn" type="button" data-act="levels">NIVEAUX</button>`}
    </div>`)
}

const failureText = (f: Failure) => {
  if (f.kind === "collision") {
    const [a, b] = f.ev.colors
    return {
      code: "E-031 · COLLISION",
      msg: `Deux balles se sont percutées : ${tokenLabel(a, "round").replace(" ronde", "")} et ${tokenLabel(b, "round").replace(" ronde", "")}.`,
      trace: `à t <b>${fmtTime(f.ev.t)}</b><br />espace-les avec les aiguillages`,
    }
  }
  if (f.kind === "miss") {
    const got = tokenLabel(f.ev.tokenColor, f.ev.tokenType)
    if (!f.ev.expected) {
      return { code: "E-043 · ARRIVÉE PLEINE", msg: `Une balle de trop est arrivée : ${got}.`, trace: `à t <b>${fmtTime(f.ev.t)}</b>` }
    }
    return {
      code: "E-042 · MAUVAISE BALLE",
      msg: `L'arrivée attendait ${tokenLabel(f.ev.expected.color, f.ev.expected.type)}, elle a reçu ${got}.`,
      trace: `à <b>ARRIVÉE</b> · t <b>${fmtTime(f.ev.t)}</b>`,
    }
  }
  return {
    code: "E-013 · IMPASSE",
    msg: `Plus aucune balle en mouvement : il manque ${f.missing} livraison${f.missing > 1 ? "s" : ""}.`,
    trace: `une balle est peut-être bloquée en bout de rail`,
  }
}

const openFail = (f: Failure) => {
  const { code, msg, trace } = failureText(f)
  openDialog("v-err", `
    <div class="head"><b>✕ Erreur de routage</b><span>${levelFile()}</span></div>
    <div class="body">
      <div class="code">${code}</div>
      <p class="msg">${msg}</p>
      <div class="trace">${trace}</div>
    </div>
    <div class="foot">
      <button class="btn" type="button" data-act="restart">↻ RÉESSAYER</button>
      <button class="btn ghost" type="button" data-act="levels">NIVEAUX</button>
    </div>`)
}

// ── API ──

export const startLevel = (i: number) => {
  const level = LEVELS[i]
  if (!level) return
  levelIndex = i
  pm = buildPreviewManager(level.json)
  pm.hudStatsEnabled = options.fps
  state = "running"
  endFn = null
  switchFlips = 0
  errors = 0
  lastScreenId = "main"
  logEl.innerHTML = ""
  addLog(`plan : <b>${level.file}</b>`)
  addLog(`› simulation lancée`)
  setText(hud.file, level.file)
  closeDialog()
  show("game")
}

export const initGame = () => {
  onShow("game", () => {
    if (pm) pm.hudStatsEnabled = options.fps
    resize()
    ensureLoop()
  })
  addEventListener("resize", () => {
    if (currentScreen() === "game") resize()
  })

  $("g-pause").addEventListener("click", () => (state === "paused" ? resume() : pause()))

  // Clic sur le plan → coordonnées logiques → clickAt (aiguillages, portails, mini-map).
  canvas.addEventListener("click", (e) => {
    if (!pm || state !== "running") return
    const r = canvas.getBoundingClientRect()
    const x = (e.clientX - r.left - offX) / scale
    const y = (e.clientY - r.top - offY) / scale
    const switches = Object.values(pm.data.switches)
    const before = switches.map((s) => s.activeIndex)
    pm.clickAt(x, y)
    switches.forEach((s, k) => {
      if (s.activeIndex === before[k]) return
      switchFlips++
      vibrate(12)
      addLog(`› AIG_${String(k + 1).padStart(2, "0")} → sortie ${s.activeIndex + 1}`)
    })
  })

  veil.addEventListener("click", (e) => {
    const act = (e.target as HTMLElement).closest("[data-act]")?.getAttribute("data-act")
    if (act === "resume") resume()
    else if (act === "restart") startLevel(levelIndex)
    else if (act === "next") startLevel(nextAfter(levelIndex))
    else if (act === "levels") show("levels")
    else if (act === "options") show("options")
  })

  // L'app passe en arrière-plan → pause automatique.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause()
  })
}
