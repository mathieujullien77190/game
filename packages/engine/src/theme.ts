// Constantes visuelles partagées par les *Editor.ts / *Preview.ts et les Managers.
// Centralise les couleurs/épaisseurs/rayons qui reviennent dans plusieurs fichiers.
// Les couleurs dynamiques (TYPE_COLOR d'un Transformer, displayColor d'un Token...) restent
// en dehors : ce fichier ne couvre que le statique, identique d'un frame à l'autre.

// Palette par défaut (éditeur + preview web). Un frontend peut la remplacer à l'exécution via
// `applyTheme` (ex. l'app mobile passe en palette « Calque ») : les entités lisent `COLORS.x` et
// `STROKE_WIDTHS.x` au moment du draw, donc muter les objets suffit — pas besoin de repasser la
// palette à chaque entité (et ne jamais capturer une de ces valeurs dans une constante de module).
const DEFAULT_COLORS = {
  // Fond du canvas de la simulation (clearBackground). "transparent" laisse voir le fond de page.
  background: "#fff",
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

  // ── Couleurs par composant (preview). Par défaut = rendu historique. ──
  // Rail sans couleur propre (LinePreview).
  rail: "#ccc",
  // Cadre d'un portail vers un écran imbriqué (ScreenGatePreview).
  gate: "#ccc",
  // Anneau d'une arrivée au repos / segments de progression (ArrivalPreview).
  arrivalRing: "#ccc",
  arrivalProgress: "#999",
  // Surcharge de la couleur des aiguillages manuels / auto. Vide = couleur définie dans la map.
  switchAccent: "",
  switchAutoAccent: "",
}

export type ThemeColors = { [K in keyof typeof DEFAULT_COLORS]: string }

export const COLORS: ThemeColors = { ...DEFAULT_COLORS }

const DEFAULT_STROKE_WIDTHS = {
  hairline: 1,
  thin: 1.5,
  base: 2,
  medium: 3,
  transformerActive: 3.5,
  bold: 4,
  heavy: 5,
  lineGlow: 6,
  switchLinkDash: 7,
  // Épaisseur d'un rail et du cadre d'un portail (preview).
  rail: 6,
  gate: 6,
}

export type ThemeStrokeWidths = { [K in keyof typeof DEFAULT_STROKE_WIDTHS]: number }

export const STROKE_WIDTHS: ThemeStrokeWidths = { ...DEFAULT_STROKE_WIDTHS }

// Remplace tout ou partie de la palette / des épaisseurs (les clés absentes gardent leur valeur).
export const applyTheme = (colors: Partial<ThemeColors>, strokes: Partial<ThemeStrokeWidths> = {}) => {
  Object.assign(COLORS, colors)
  Object.assign(STROKE_WIDTHS, strokes)
}

// Revient au thème par défaut.
export const resetTheme = () => {
  Object.assign(COLORS, DEFAULT_COLORS)
  Object.assign(STROKE_WIDTHS, DEFAULT_STROKE_WIDTHS)
}

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
