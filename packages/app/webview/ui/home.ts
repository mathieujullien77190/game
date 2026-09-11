import { $ } from "./dom"
import { LEVELS, doneCount, nextLevelIndex } from "./levels"
import { onShow, show } from "./router"

// Écran d'accueil : schéma annoté au crayon, LANCER lance le prochain niveau non terminé.

export const initHome = (start: (i: number) => void) => {
  const play = $<HTMLButtonElement>("h-play")

  play.addEventListener("click", () => start(nextLevelIndex()))
  $("h-levels").addEventListener("click", () => show("levels"))
  $("h-options").addEventListener("click", () => show("options"))

  onShow("home", () => {
    $("h-progress").textContent = `✓ ${doneCount()}/${LEVELS.length}`
    play.disabled = LEVELS.length === 0
    $("h-cmd").textContent = LEVELS.length === 0 ? "aucun niveau injecté" : `prochain : ${LEVELS[nextLevelIndex()].file}`
  })
}
