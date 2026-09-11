import { $ } from "./dom"

// Navigation entre les 4 écrans (sections de index.html). Un seul visible à la fois.
export type ScreenId = "home" | "levels" | "game" | "options"

const screens: Record<ScreenId, HTMLElement> = {
  home: $("s-home"),
  levels: $("s-levels"),
  game: $("s-game"),
  options: $("s-options"),
}

let current: ScreenId = "home"
let previous: ScreenId = "home"
const showListeners: Partial<Record<ScreenId, () => void>> = {}
const hideListeners: Partial<Record<ScreenId, () => void>> = {}

export const onShow = (id: ScreenId, fn: () => void) => { showListeners[id] = fn }
export const onHide = (id: ScreenId, fn: () => void) => { hideListeners[id] = fn }

export const show = (id: ScreenId) => {
  if (id !== current) {
    hideListeners[current]?.()
    previous = current
  }
  current = id
  for (const [k, el] of Object.entries(screens)) el.hidden = k !== id
  showListeners[id]?.()
}

// Retour à l'écran d'où l'on vient (ex. fermer les options ouvertes depuis la pause).
export const back = () => show(previous === current ? "home" : previous)

export const currentScreen = () => current
