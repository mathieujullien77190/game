import * as S from "./UI"

interface Props {
  value: number
  onChange: (v: number) => void
  label?: string
  min?: number
  step?: number
}

export const NumberInput = ({ value, onChange, label, min = 0, step = 1 }: Props) => {
  const input = (
    <S.Input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(e) => {
        const v = parseInt(e.target.value)
        onChange(isNaN(v) || v < (min ?? 0) ? (min ?? 0) : v)
      }}
    />
  )

  if (!label) return input

  return (
    <S.Row>
      <S.Label>{label}</S.Label>
      {input}
    </S.Row>
  )
}
