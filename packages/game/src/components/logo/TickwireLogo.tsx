import { useEffect, useRef } from "react"
import { buildClockTicks, initAngles, rot } from "./helpers"
import {
  LOGO_VIEW,
  LOGO_CX,
  LOGO_CY,
  BASE_SEC_SPEED,
  SPEED_MULTIPLIERS,
  PHASE_DURATION,
} from "./constants"

export const TickwireLogo = ({ size }: { size?: number }) => {
  const ticks = buildClockTicks()
  const hourRef = useRef<SVGGElement>(null)
  const minRef = useRef<SVGGElement>(null)
  const secRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const init = initAngles()
    let phaseIdx = 0
    let phaseStart = performance.now()
    let baseSec = init.sec
    let baseMin = init.min
    let baseHour = init.hour
    let raf: number

    const loop = (now: number) => {
      const phaseElapsed = (now - phaseStart) / 1000

      if (phaseElapsed >= PHASE_DURATION) {
        const mult = SPEED_MULTIPLIERS[phaseIdx % SPEED_MULTIPLIERS.length]
        baseSec += PHASE_DURATION * BASE_SEC_SPEED * mult
        baseMin += (PHASE_DURATION * BASE_SEC_SPEED * mult) / 60
        baseHour += (PHASE_DURATION * BASE_SEC_SPEED * mult) / 720
        phaseIdx++
        phaseStart = now
      }

      const elapsed = (now - phaseStart) / 1000
      const mult = SPEED_MULTIPLIERS[phaseIdx % SPEED_MULTIPLIERS.length]
      const secSpeed = BASE_SEC_SPEED * mult

      secRef.current?.setAttribute("transform", rot(baseSec + elapsed * secSpeed, LOGO_CX, LOGO_CY))
      minRef.current?.setAttribute(
        "transform",
        rot(baseMin + (elapsed * secSpeed) / 60, LOGO_CX, LOGO_CY)
      )
      hourRef.current?.setAttribute(
        "transform",
        rot(baseHour + (elapsed * secSpeed) / 720, LOGO_CX, LOGO_CY)
      )

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg width={size ?? "100%"} height={size ?? "100%"} viewBox={`0 0 ${LOGO_VIEW} ${LOGO_VIEW}`}>
      <circle
        cx={LOGO_CX}
        cy={LOGO_CY}
        r="93"
        fill="none"
        stroke="#1B2559"
        strokeWidth="1"
        opacity="0.07"
      />
      <circle cx={LOGO_CX} cy={LOGO_CY} r="78" fill="#fff" stroke="#e8e8f0" strokeWidth="1.5" />

      {ticks.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#1B2559"
          strokeWidth={t.major ? 2 : 1}
          opacity={t.major ? 0.22 : 0.12}
        />
      ))}

      <g ref={hourRef}>
        <line
          x1={LOGO_CX}
          y1={LOGO_CY}
          x2="130"
          y2="67"
          stroke="#FF5630"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="130" cy="67" r="9" fill="#FF5630" />
        <circle cx="130" cy="67" r="18" fill="#FF5630" opacity="0.12" />
      </g>

      <g ref={minRef}>
        <line
          x1={LOGO_CX}
          y1={LOGO_CY}
          x2={LOGO_CX}
          y2="33"
          stroke="#3A6FD8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx={LOGO_CX} cy="33" r="7" fill="#3A6FD8" />
        <circle cx={LOGO_CX} cy="33" r="14" fill="#3A6FD8" opacity="0.12" />
      </g>

      <g ref={secRef}>
        <line
          x1={LOGO_CX}
          y1={LOGO_CY}
          x2="55"
          y2="148"
          stroke="#2E9E6B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="55" cy="148" r="5" fill="#2E9E6B" />
        <circle cx="55" cy="148" r="10" fill="#2E9E6B" opacity="0.12" />
      </g>

      <circle cx={LOGO_CX} cy={LOGO_CY} r="9" fill="#fff" stroke="#1B2559" strokeWidth="3.5" />
      <circle cx={LOGO_CX} cy={LOGO_CY} r="3.5" fill="#1B2559" />
    </svg>
  )
}
