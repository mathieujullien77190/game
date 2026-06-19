export const DEFAULT_COLOR = "#000000";

export const PALETTE = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#6b7280",
] as const;

export type GameColor = (typeof PALETTE)[number];

export const DEFAULT_TOKEN_COLOR = "#ef4444";

export const lerpColor = (a: string, b: string, t: number): string => {
  const p = (hex: string, o: number) => parseInt(hex.slice(o, o + 2), 16);
  const r = Math.round(p(a, 1) + (p(b, 1) - p(a, 1)) * t);
  const g = Math.round(p(a, 3) + (p(b, 3) - p(a, 3)) * t);
  const bl = Math.round(p(a, 5) + (p(b, 5) - p(a, 5)) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
};

export const EDITOR_COLORS = {
  anchorStart: "#2563eb",
  anchorStartBg: "#dbeafe",
  anchorEnd: "#16a34a",
  anchorEndBg: "#dcfce7",
  pointCurve: "#7c3aed",
  pointCurveBg: "#f3e8ff",
  departure: "#f59e0b",
  departureBorder: "#d97706",
  arrival: "#22c55e",
  arrivalBorder: "#16a34a",
} as const;
