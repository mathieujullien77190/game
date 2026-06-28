import { useEffect, useRef, useState } from "react"
import { perf } from "engine/perf"
import * as S from "./UI"

const ALPHA = 0.9

export const DebugOverlay = () => {
  const [fps, setFps] = useState(0)
  const [ms, setMs] = useState(0)
  const smoothFps = useRef(0)
  const smoothMs = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const loop = () => {
      smoothFps.current = smoothFps.current * ALPHA + perf.fps * (1 - ALPHA)
      smoothMs.current = smoothMs.current * ALPHA + perf.ms * (1 - ALPHA)
      setFps(Math.round(smoothFps.current))
      setMs(parseFloat(smoothMs.current.toFixed(2)))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <S.Wrap>
      {fps} fps · {ms} ms
    </S.Wrap>
  )
}
