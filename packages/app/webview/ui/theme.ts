import { applyTheme } from "@tic-tac-tic/engine/theme"

// Palette « Calque » (Blueprint D) appliquée au rendu de l'engine (canvas), alignée sur les
// variables CSS de index.html : fond transparent (la grille de la page se voit), intérieurs des
// nœuds = papier, traits d'encre bleue. Même code couleur que l'UI : orange = interactif / objectif
// (aiguillages, arrivée), crayon = portails, vert = progression. Les couleurs des balles (maps) ne changent pas.
const CALQUE = {
  paper: "#f6f4ee",
  ink: "#1d4e89",
  inkSoft: "#6b8db5",
  pencil: "#5b5f66",
  orange: "#ff7a00",
  ok: "#2e9e6b",
  err: "#d64545",
}

export const applyCalqueTheme = () =>
  applyTheme(
    {
      background: "transparent",
      white: CALQUE.paper,
      black: CALQUE.ink,
      ink: CALQUE.inkSoft,
      gray: CALQUE.inkSoft,
      grayDark: CALQUE.ink,
      grayLight: CALQUE.inkSoft,
      gridMinor: "rgba(29, 78, 137, 0.07)",
      gridMajor: "rgba(29, 78, 137, 0.14)",
      red: CALQUE.err,
      arrivalMatch: CALQUE.ok,
      rail: CALQUE.ink,
      gate: CALQUE.pencil,
      arrivalRing: CALQUE.orange,
      arrivalProgress: CALQUE.ok,
      switchAccent: CALQUE.orange,
      switchAutoAccent: CALQUE.inkSoft,
    },
    // traits d'encre fins, façon dessin technique
    { rail: 2.5, gate: 2, heavy: 2.5, bold: 3, transformerActive: 2.5 },
  )

// Noms lisibles des couleurs de balles (palette de Token.ts) pour les messages d'erreur.
const COLOR_NAMES: Record<string, string> = {
  "#e53935": "rouge", "#fb8c00": "orange", "#fdd835": "jaune", "#43a047": "verte", "#00acc1": "cyan",
  "#1a73e8": "bleue", "#8e24aa": "violette", "#e91e63": "rose", "#546e7a": "grise",
  "#ffcdd2": "rouge pâle", "#ffe0b2": "orange pâle", "#fff59d": "jaune pâle", "#a5d6a7": "verte pâle",
  "#b2ebf2": "cyan pâle", "#90caf9": "bleue pâle", "#ce93d8": "violette pâle", "#f8bbd0": "rose pâle",
  "#cfd8dc": "grise pâle",
}

const SHAPE_NAMES: Record<string, string> = { round: "ronde", square: "carrée", triangle: "triangulaire", cop: "police" }

export const colorName = (hex: string) => COLOR_NAMES[hex.toLowerCase()] ?? hex

// « ● rouge carrée » en HTML (pastille de couleur + nom + forme).
export const tokenLabel = (color: string, type: string) =>
  `<span class="sw" style="background:${color}"></span>${colorName(color)} ${SHAPE_NAMES[type] ?? type}`
