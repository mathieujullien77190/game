import { useMemo } from "react"
import styled, { keyframes } from "styled-components"

const COLORS = ["#FF5630", "#3A6FD8", "#2E9E6B"]
const COUNT = 60

const burst = (tx: number, ty: number) => keyframes`
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  60%  { opacity: 1; }
  100% { transform: translate(${tx}px, ${ty}px) scale(0.3); opacity: 0; }
`

const Particle = styled.div<{
  $size: number; $color: string; $duration: number; $delay: number; $round: boolean; $tx: number; $ty: number
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-left: ${({ $size }) => -$size / 2}px;
  margin-top: ${({ $size }) => -$size / 2}px;
  background: ${({ $color }) => $color};
  border-radius: ${({ $round }) => ($round ? "50%" : "3px")};
  animation: ${({ $tx, $ty }) => burst($tx, $ty)} ${({ $duration }) => $duration}s ${({ $delay }) => $delay}s ease-out 1 forwards;
  pointer-events: none;
`

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
`

type P = { size: number; color: string; duration: number; delay: number; round: boolean; tx: number; ty: number }

export const Confetti = () => {
  const particles = useMemo<P[]>(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist = 80 + Math.random() * 200
      return {
        size: 5 + Math.random() * 9,
        color: COLORS[i % COLORS.length],
        duration: 0.6 + Math.random() * 0.8,
        delay: Math.random() * 0.3,
        round: Math.random() > 0.4,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
      }
    }), [])

  return (
    <Wrap>
      {particles.map((p, i) => (
        <Particle key={i} $size={p.size} $color={p.color} $duration={p.duration} $delay={p.delay} $round={p.round} $tx={p.tx} $ty={p.ty} />
      ))}
    </Wrap>
  )
}
