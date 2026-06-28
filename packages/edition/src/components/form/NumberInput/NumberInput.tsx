import { useState, useEffect, useRef } from "react"
import * as S from "./UI"

interface Props {
  value: number
  onChange: (v: number) => void
  label?: string
  min?: number
  step?: number
  float?: boolean
}

export const NumberInput = ({ value, onChange, label, min = 0, step = 1, float = false }: Props) => {
  const [text, setText] = useState(String(value))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setText(String(value))
  }, [value])

  const input = (
    <S.Input
      type="number"
      min={min}
      step={step}
      value={text}
      onFocus={() => { focused.current = true }}
      onBlur={() => {
        focused.current = false
        const v = float ? parseFloat(text) : parseInt(text)
        if (!isNaN(v) && v >= min) {
          onChange(v)
        } else {
          setText(String(value))
        }
      }}
      onChange={(e) => {
        setText(e.target.value)
        const v = float ? parseFloat(e.target.value) : parseInt(e.target.value)
        if (!isNaN(v) && v >= min) onChange(v)
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
