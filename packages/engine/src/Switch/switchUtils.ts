import type { Link, LinkEndpoint } from "../Link/Link"
import type { LinePoint } from "../types"

export const getSwitchEnterPoint = (
  linkIds: string[],
  links: Record<string, Link>
): LinkEndpoint | null => {
  if (linkIds.length === 0) return null
  const first = links[linkIds[0]]
  if (!first) return null
  let candidates: LinkEndpoint[] = [{ ...first.line1 }, { ...first.line2 }]
  for (const lkId of linkIds.slice(1)) {
    const lk = links[lkId]
    if (!lk) continue
    candidates = candidates.filter(
      (c) =>
        (lk.line1.lineId === c.lineId && lk.line1.endpoint === c.endpoint) ||
        (lk.line2.lineId === c.lineId && lk.line2.endpoint === c.endpoint)
    )
  }
  return candidates[0] ?? null
}

export const curveIntersectAngle = (
  pts: LinePoint[],
  endpointSide: "start" | "end",
  cx: number,
  cy: number,
  r: number
): number | undefined => {
  const startIdx = endpointSide === "end" ? pts.length - 1 : 0
  const dir = endpointSide === "end" ? -1 : 1

  let prevX = pts[startIdx].x
  let prevY = pts[startIdx].y
  let prevDist = 0

  let idx = startIdx + dir
  while (idx >= 0 && idx < pts.length) {
    const p = pts[idx]
    const dx = p.x - cx
    const dy = p.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist >= r) {
      const t = prevDist < r ? (r - prevDist) / (dist - prevDist) : 1
      const ix = prevX + t * (p.x - prevX)
      const iy = prevY + t * (p.y - prevY)
      return Math.atan2(iy - cy, ix - cx)
    }
    prevX = p.x
    prevY = p.y
    prevDist = dist
    idx += dir
  }
  return undefined
}
