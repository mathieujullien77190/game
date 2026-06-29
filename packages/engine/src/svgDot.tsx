import type { JSX } from "react"
import * as SVG from "./svgElements"
import { COLOR_WHITE } from "./constants"

const SIZES = { big: 7, small: 6 } as const

export const svgDot = (cx: number, cy: number, size: "big" | "small", strokeColor?: string): JSX.Element => {
  const r = SIZES[size]
  return (
    <SVG.circle
      cx={cx} cy={cy} r={r}
      fill={COLOR_WHITE}
      stroke={strokeColor ?? "#ccc"}
      strokeWidth={size === "big" ? 3 : 2}
    />
  )
}
