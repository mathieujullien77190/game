import { IoLockClosed, IoStar, IoStarOutline } from "react-icons/io5"
import { formatTime } from "maps"
import { T } from "theme"
import type { Props } from "./types"
import * as S from "./UI"

const Stars = ({ n }: { n: number }) => (
  <>
    {Array.from({ length: 3 }, (_, i) => (
      i < n ? <IoStar key={i} /> : <IoStarOutline key={i} />
    ))}
  </>
)

export const MapCard = ({ num, locked, accent, label, result, onClick }: Props) => (
  <S.Card $locked={locked} $accent={accent} onClick={locked ? undefined : onClick}>
    {!locked && <S.AccentBar $color={accent} />}
    {locked ? (
      <S.LockIcon><IoLockClosed /></S.LockIcon>
    ) : (
      <>
        <S.Label>{label}</S.Label>
        <S.Number $locked={false}>{String(num).padStart(2, "0")}</S.Number>
        {result ? (
          <>
            <S.Stars $color={T.gold}><Stars n={result.stars} /></S.Stars>
            <S.Time $color={accent}>{formatTime(result.bestTime)}</S.Time>
          </>
        ) : (
          <S.Stars $color={T.border}><Stars n={0} /></S.Stars>
        )}
      </>
    )}
  </S.Card>
)
