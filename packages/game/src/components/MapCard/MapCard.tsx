import { Ionicons } from "@expo/vector-icons"
import { formatTime } from "maps"
import { T } from "theme"
import type { Props } from "./types"
import * as S from "./UI"

const Stars = ({ n, color }: { n: number; color: string }) => (
  <S.Stars $color={color}>
    {Array.from({ length: 3 }, (_, i) => (
      <Ionicons key={i} name={i < n ? "star" : "star-outline"} size={14} color={color} />
    ))}
  </S.Stars>
)

export const MapCard = ({ num, locked, accent, label, result, onClick }: Props) => (
  <S.Card $locked={locked} $accent={accent} onPress={locked ? undefined : onClick} activeOpacity={locked ? 1 : 0.8}>
    {!locked && <S.AccentBar $color={accent} />}
    {locked ? (
      <S.LockIcon>
        <Ionicons name="lock-closed" size={22} color={T.muted} />
      </S.LockIcon>
    ) : (
      <>
        <S.Label>{label}</S.Label>
        <S.Number $locked={false}>{String(num).padStart(2, "0")}</S.Number>
        {result ? (
          <>
            <Stars n={result.stars} color={T.gold} />
            <S.Time $color={accent}>{formatTime(result.bestTime)}</S.Time>
          </>
        ) : (
          <Stars n={0} color={T.border} />
        )}
      </>
    )}
  </S.Card>
)
