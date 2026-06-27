import type { Line } from "./Line"

export const linePath = (line: Line): string => {
  const { start: s, end: e, cp1, cp2, type, points } = line
  if (type === "straight") return `M${s.x},${s.y}L${e.x},${e.y}`
  if (type === "curve" || type === "elbow")
    return `M${s.x},${s.y}C${cp1.x},${cp1.y},${cp2.x},${cp2.y},${e.x},${e.y}`
  if (!points.length) return ""
  return `M${points[0].x},${points[0].y}` + points.slice(1).map((p) => `L${p.x},${p.y}`).join("")
}
