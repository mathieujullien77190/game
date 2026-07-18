// Constantes visuelles partagées par les *Editor.ts / *Preview.ts et les Managers.
// Centralise les couleurs/épaisseurs/rayons qui reviennent dans plusieurs fichiers.
// Les couleurs dynamiques (this.color d'un Switch, TYPE_COLOR d'un Transformer,
// displayColor d'un Token...) restent en dehors : ce fichier ne couvre que le
// statique, identique d'un frame à l'autre.

export const COLORS = {
  black: "#000",
  white: "#fff",
  ink: "#333",

  gray: "#999",
  grayDark: "#666",
  grayLight: "#ccc",
  gridMinor: "#f0f0f0",
  gridMajor: "#e0e0e0",

  red: "#e53935",
  green: "#4caf50",
  blue: "#1a73e8",
  amber: "#f9ab00",
  glow: "#ffcc00",
  limitationRed: "#e00",
  limitationRedPastel: "#f5a3a3",

  switchGhost: "#7c3aed",
  inverterAccent: "#7b1fa2",
  cp2Purple: "#9c27b0",
  clonerGhost: "#ff7043",

  arrivalMatch: "#2E9E6B",
} as const

export const STROKE_WIDTHS = {
  hairline: 1,
  thin: 1.5,
  base: 2,
  medium: 3,
  transformerActive: 3.5,
  bold: 4,
  heavy: 5,
  lineGlow: 6,
  switchLinkDash: 7,
} as const

export const ALPHA = {
  hovered: 1,
  dimmed: 0.4,
  ghostPreview: 0.45,
} as const

export const RADII = {
  // Rayon commun aux nœuds Switch et Transformer (éditeur + ghost-preview).
  node: 18,
  // Anneau commun à Start (countdown) / Arrival (progression) / Transformer (orbite).
  ring: 20,
  // Disque noir de Start/Arrival en mode éditeur + ghost-preview.
  entityDot: 14,
} as const
