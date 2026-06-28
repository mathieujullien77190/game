import { LOGO_CX, LOGO_CY, DRAWN_HOUR, DRAWN_MIN, DRAWN_SEC } from "./constants"

export type ClockTick = {
  key: number
  x1: number
  y1: number
  x2: number
  y2: number
  major: boolean
}

export const buildClockTicks = (): ClockTick[] =>
  Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    return {
      key: i,
      x1: LOGO_CX + Math.cos(angle) * 74,
      y1: LOGO_CY + Math.sin(angle) * 74,
      x2: LOGO_CX + Math.cos(angle) * (i % 3 === 0 ? 62 : 69),
      y2: LOGO_CY + Math.sin(angle) * (i % 3 === 0 ? 62 : 69),
      major: i % 3 === 0,
    }
  })

export const initAngles = () => {
  const s = 42
  const m = 50 + s / 60
  const h = 1 + m / 60
  return {
    sec: (s / 60) * 360 - DRAWN_SEC,
    min: (m / 60) * 360 - DRAWN_MIN,
    hour: (h / 12) * 360 - DRAWN_HOUR,
  }
}

export const rot = (deg: number, cx: number, cy: number) => `rotate(${deg}, ${cx}, ${cy})`
