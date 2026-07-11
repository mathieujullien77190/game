import { useState } from "react"
import { Field } from "components/form/Field"
import * as S from "./UI"

interface Props {
  value: number
  onChange: (v: number) => void
  label?: string
  min?: number
  max?: number
  step?: number
  commitOn?: "change" | "blur"
}

const clamp = (v: number, min?: number, max?: number) => {
  let r = v
  if (min !== undefined) r = Math.max(min, r)
  if (max !== undefined) r = Math.min(max, r)
  return r
}

const round = (v: number) => Math.round(v * 1000) / 1000

export const NumberInput = ({ value, onChange, label, min = 0, max, step = 1, commitOn = "change" }: Props) => {
  const [prevValue, setPrevValue] = useState(value)
  const [local, setLocal] = useState(String(value))

  if (value !== prevValue) {
    setPrevValue(value)
    setLocal(String(value))
  }

  const commit = () => {
    const v = parseFloat(local)
    if (!isNaN(v)) onChange(clamp(v, min, max))
    else setLocal(String(value))
  }

  const nudge = (delta: number) => {
    const v = clamp(round(value + delta), min, max)
    setPrevValue(v)
    setLocal(String(v))
    onChange(v)
  }

  const atMin = min !== undefined && value <= min
  const atMax = max !== undefined && value >= max

  const input = (
    <S.Row>
      <S.StepButton disabled={atMin} onClick={() => nudge(-1)}>−1</S.StepButton>
      <S.StepButton disabled={atMin} onClick={() => nudge(-0.1)}>−.1</S.StepButton>
      <S.Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(e) => {
          setLocal(e.target.value)
          if (commitOn !== "change") return
          const v = parseFloat(e.target.value)
          if (!isNaN(v)) onChange(clamp(v, min, max))
        }}
        onBlur={() => (commitOn === "blur" ? commit() : setLocal(String(value)))}
      />
      <S.StepButton disabled={atMax} onClick={() => nudge(0.1)}>+.1</S.StepButton>
      <S.StepButton disabled={atMax} onClick={() => nudge(1)}>+1</S.StepButton>
    </S.Row>
  )

  if (!label) return input

  return <Field label={label} $direction="row">{input}</Field>
}
