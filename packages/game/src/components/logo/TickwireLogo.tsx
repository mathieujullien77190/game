import { buildClockTicks, initAngles, rot } from "./helpers"
import { LOGO_VIEW, LOGO_CX, LOGO_CY } from "./constants"

export const TickwireLogo = ({ size }: { size?: number }) => {
  const ticks = buildClockTicks()
  const angles = initAngles()

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

      <g transform={rot(angles.hour, LOGO_CX, LOGO_CY)}>
        <line x1={LOGO_CX} y1={LOGO_CY} x2="130" y2="67" stroke="#FF5630" strokeWidth="9" strokeLinecap="round" />
        <circle cx="130" cy="67" r="9" fill="#FF5630" />
        <circle cx="130" cy="67" r="18" fill="#FF5630" opacity="0.12" />
      </g>

      <g transform={rot(angles.min, LOGO_CX, LOGO_CY)}>
        <line x1={LOGO_CX} y1={LOGO_CY} x2={LOGO_CX} y2="33" stroke="#3A6FD8" strokeWidth="6" strokeLinecap="round" />
        <circle cx={LOGO_CX} cy="33" r="7" fill="#3A6FD8" />
        <circle cx={LOGO_CX} cy="33" r="14" fill="#3A6FD8" opacity="0.12" />
      </g>

      <g transform={rot(angles.sec, LOGO_CX, LOGO_CY)}>
        <line x1={LOGO_CX} y1={LOGO_CY} x2="55" y2="148" stroke="#2E9E6B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="55" cy="148" r="5" fill="#2E9E6B" />
        <circle cx="55" cy="148" r="10" fill="#2E9E6B" opacity="0.12" />
      </g>

      <circle cx={LOGO_CX} cy={LOGO_CY} r="9" fill="#fff" stroke="#1B2559" strokeWidth="3.5" />
      <circle cx={LOGO_CX} cy={LOGO_CY} r="3.5" fill="#1B2559" />
    </svg>
  )
}
