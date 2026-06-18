import type { Props } from "./types";
import * as S from "./UI";

export const NumberInput = ({ value, onChange, label, unit, min, max, step = 1 }: Props) => (
  <S.Row>
    {label && <S.Label>{label}</S.Label>}
    <S.Input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value);
        const clamped = min !== undefined ? Math.max(min, parsed || 0) : parsed || 0;
        onChange(max !== undefined ? Math.min(max, clamped) : clamped);
      }}
    />
    {unit && <S.Unit>{unit}</S.Unit>}
  </S.Row>
);
