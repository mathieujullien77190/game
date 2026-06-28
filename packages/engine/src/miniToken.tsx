import type { JSX } from "react"

export const miniToken = (id: string, x: number, y: number, r: number, color: string, isSquare: boolean): JSX.Element =>
  isSquare
    ? <rect key={id} x={x - r} y={y - r} width={r * 2} height={r * 2} fill={color} />
    : <circle key={id} cx={x} cy={y} r={r} fill={color} />
