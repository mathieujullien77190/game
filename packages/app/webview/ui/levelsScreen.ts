import { $, fmtTime } from "./dom"
import { LEVELS, doneCount, nextLevelIndex } from "./levels"
import { getProgress } from "./storage"
import { onShow, show } from "./router"

// Écran « Plans » : les niveaux à la suite, une ligne par niveau (numéro, état, meilleur temps).

const list = $("l-list")

const render = (start: (i: number) => void) => {
  list.innerHTML = ""
  const cur = nextLevelIndex()
  LEVELS.forEach((level, i) => {
    const p = getProgress(level.id)
    const row = document.createElement("button")
    row.type = "button"
    row.className = i === cur ? "level cur" : "level"
    row.innerHTML = `
      <span class="num">${String(i + 1).padStart(2, "0")}</span>
      <span class="name">${level.file}</span>
      ${p.done ? `<span class="state done">✓ ${fmtTime(p.best ?? 0)}</span>` : `<span class="state">${i === cur ? "à jouer" : "—"}</span>`}`
    row.addEventListener("click", () => start(i))
    list.append(row)
  })
  $("l-count").textContent = `${LEVELS.length} niveau${LEVELS.length > 1 ? "x" : ""}`
  $("l-done").textContent = `✓ ${doneCount()} / ${LEVELS.length}`
}

export const initLevels = (start: (i: number) => void) => {
  $("l-close").addEventListener("click", () => show("home"))
  onShow("levels", () => render(start))
}
