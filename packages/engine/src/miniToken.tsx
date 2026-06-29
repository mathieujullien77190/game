import type { JSX } from "react"
import * as SVG from "./svgElements"

export const miniToken = (id: string, x: number, y: number, r: number, color: string, isSquare: boolean): JSX.Element =>
  isSquare
    ? <SVG.rect key={id} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={color} />
    : <SVG.circle key={id} cx={x} cy={y} r={r} fill={color} />
