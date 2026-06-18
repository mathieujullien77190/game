import { Field } from "components/form/Field";
import type { Props } from "./types";
import * as S from "./UI";

const InputRow = ({ value, onChange, unit, min, max, step = 1 }: Omit<Props, "label">) => (
  <S.Row>
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

export const NumberInput = ({ label, ...rest }: Props) =>
  label ? (
    <Field label={label}>
      <InputRow {...rest} />
    </Field>
  ) : (
    <InputRow {...rest} />
  );
