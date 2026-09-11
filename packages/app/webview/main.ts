// Entrée web du jeu, chargée DANS la WebView de l'app RN (et par `yarn app:web` en dev).
// Fait tourner la simulation de l'engine en canvas2d, habillée par une UI « Calque » (Blueprint D) en DOM
// (écrans accueil / niveaux / jeu / options, cf. ui/). Les niveaux sont injectés dans
// `window.__TICTACTIC_LEVELS__` avant le chargement → pas de rebuild quand une map change.

import { setAnimationsEnabled } from "@tic-tac-tic/engine/entities/Animation"
import { applyCalqueTheme } from "./ui/theme"
import { options } from "./ui/storage"
import { show } from "./ui/router"
import { initGame, startLevel } from "./ui/game"
import { initLevels } from "./ui/levelsScreen"
import { initOptions } from "./ui/optionsScreen"
import { initHome } from "./ui/home"

applyCalqueTheme()

const applyOptions = () => {
  document.body.classList.toggle("no-grid", !options.grid)
  setAnimationsEnabled(options.animations)
}

initGame()
initLevels(startLevel)
initHome(startLevel)
initOptions(applyOptions)

applyOptions()
show("home")
