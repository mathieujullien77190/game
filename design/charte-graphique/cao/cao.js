// Charte CAO — comportements partagés : plan du niveau injecté dans [data-level], réticule + coordonnées.

// Plan d'un niveau type (portrait 360×520) : 3 départs, un transformer, un écran imbriqué ×0.5,
// un aiguillage, l'arrivée et une voie de garage. `data-level="error"` met en évidence une balle fautive.
const LEVEL_SVG = (variant) => `
<svg class="level" viewBox="0 0 360 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <rect class="screen" x="236" y="66" width="112" height="170" rx="4" />
  <text class="lbl" x="242" y="80" style="fill:#4fc3ff">ÉCRAN_1 · ×0.5</text>

  <path class="rail" d="M60 40 L60 200 Q60 240 100 256 L180 290" />
  <path class="rail" d="M180 40 L180 290" />
  <path class="rail" d="M300 40 L300 150 Q300 200 260 230 L180 290" />
  <path class="rail" d="M180 290 L180 430" />
  <path class="rail" d="M180 290 L300 390 L300 430" style="stroke-dasharray:6 5;opacity:.55" />

  <circle class="node" cx="60" cy="40" r="9" /><circle class="node" cx="180" cy="40" r="9" /><circle class="node" cx="300" cy="40" r="9" />
  <text class="lbl" x="72" y="37">S_A</text><text class="lbl" x="192" y="37">S_B</text><text class="lbl" x="312" y="37">S_C</text>

  <rect x="170" y="140" width="20" height="20" fill="#081626" stroke="#ff9f1c" stroke-width="2" />
  <circle cx="180" cy="150" r="4" fill="#ff5d5d" />
  <text class="lbl" x="196" y="154">T · ROUGE</text>

  <rect class="sw" x="171" y="281" width="18" height="18" />
  <path d="M180 286 L180 296 M176 292 L180 296 L184 292" stroke="#ff9f1c" stroke-width="1.6" fill="none" />
  <text class="lbl" x="196" y="286">SW_01</text>

  <circle cx="180" cy="446" r="16" fill="none" stroke="#eaf4ff" stroke-width="2" />
  <circle cx="180" cy="446" r="10" fill="none" stroke="#ff9f1c" stroke-width="2" />
  <text class="lbl" x="202" y="444">ARRIVÉE</text><text class="lbl" x="202" y="456">3× ● ROUGE</text>
  <text class="lbl" x="284" y="446">GARAGE</text>

  <circle r="6" fill="#ff5d5d"><animateMotion dur="5s" repeatCount="indefinite" path="M180 40 L180 430" /></circle>
  <circle r="6" fill="#eaf4ff"><animateMotion dur="6s" begin="-2s" repeatCount="indefinite" path="M60 40 L60 200 Q60 240 100 256 L180 290 L180 430" /></circle>
  <circle r="6" fill="#4fc3ff"><animateMotion dur="9s" begin="-4s" repeatCount="indefinite" path="M300 40 L300 150 Q300 200 260 230 L180 290 L180 430" /></circle>
  ${
    variant === "error"
      ? `<circle cx="180" cy="430" r="7" fill="#4fc3ff" />
         <circle cx="180" cy="430" r="15" fill="none" stroke="#ff5d5d" stroke-width="2"><animate attributeName="r" values="12;22;12" dur="1.2s" repeatCount="indefinite" /></circle>
         <path d="M160 410 l40 40 M200 410 l-40 40" stroke="#ff5d5d" stroke-width="2" />`
      : ""
  }
</svg>`

document.querySelectorAll("[data-level]").forEach((el) => {
  el.innerHTML = LEVEL_SVG(el.dataset.level)
})

// Réticule plein écran : suit le pointeur (magnétisme grille 20px) ; au repos, dérive seul.
if (document.body.hasAttribute("data-crosshair")) {
  const mk = (cls) => document.body.appendChild(Object.assign(document.createElement("div"), { className: cls }))
  const v = mk("xh-v"), h = mk("xh-h"), b = mk("xh-box")
  const xy = document.getElementById("xy")
  let px = null, idleAt = 0
  const place = (x, y) => {
    const sx = Math.round(x / 20) * 20, sy = Math.round(y / 20) * 20
    v.style.left = sx + "px"; h.style.top = sy + "px"
    b.style.left = sx + "px"; b.style.top = sy + "px"
    if (xy) xy.textContent = `X ${(sx / 10).toFixed(2)} · Y ${(sy / 10).toFixed(2)}`
  }
  addEventListener("pointermove", (e) => { px = e.clientX; idleAt = performance.now() + 2500; place(e.clientX, e.clientY) })
  const loop = (t) => {
    if (px === null || t > idleAt) place(innerWidth / 2 + Math.sin(t / 1300) * innerWidth * 0.32, innerHeight / 2 + Math.sin(t / 900) * innerHeight * 0.28)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}

// Chrono en direct pour les écrans qui ont #clock.
const clock = document.getElementById("clock")
if (clock) {
  const t0 = performance.now() - 12400
  const tick = () => {
    const s = (performance.now() - t0) / 1000
    clock.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`
    requestAnimationFrame(tick)
  }
  tick()
}
