import { useEffect, useState } from "react"
import { Profiler, type ProfileStat } from "@drift/engine/Profiler"
import * as S from "./UI"

const POLL_MS = 250

export const PerfTab = () => {
  const [stats, setStats] = useState<ProfileStat[]>([])

  useEffect(() => {
    const id = setInterval(() => setStats(Profiler.getStats()), POLL_MS)
    return () => clearInterval(id)
  }, [])

  if (stats.length === 0) {
    return (
      <S.Container>
        <S.Empty>Lance la preview pour mesurer le temps de chaque passe de rendu.</S.Empty>
      </S.Container>
    )
  }

  const totalMs = stats.reduce((sum, s) => sum + s.avgMs, 0)

  return (
    <S.Container>
      <S.Table>
        <S.HeaderRow>
          <S.HeaderCell>Passe</S.HeaderCell>
          <S.HeaderCell>ms</S.HeaderCell>
          <S.HeaderCell>%</S.HeaderCell>
        </S.HeaderRow>
        {stats.map((s) => (
          <S.Row key={s.label}>
            <S.Cell>{s.label}</S.Cell>
            <S.Cell>{s.avgMs.toFixed(2)}</S.Cell>
            <S.BarCell>
              <S.BarTrack>
                <S.BarFill $pct={s.pct} />
              </S.BarTrack>
              <S.PctLabel>{s.pct.toFixed(1)}%</S.PctLabel>
            </S.BarCell>
          </S.Row>
        ))}
      </S.Table>
      <S.Total>total mesuré : {totalMs.toFixed(2)} ms</S.Total>
    </S.Container>
  )
}
