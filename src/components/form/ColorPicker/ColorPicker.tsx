import { Field } from "components/form/Field";
import type { ColorPickerProps } from "./types";
import * as S from "./UI";

const Swatches = ({ palette, value, onChange }: Omit<ColorPickerProps, "label">) => (
  <S.Palette>
    {palette.map((color) => (
      <S.Swatch
        key={color}
        type="button"
        $color={color}
        $selected={value === color}
        onClick={() => onChange(color)}
      />
    ))}
  </S.Palette>
);

export const ColorPicker = ({ palette, value, onChange, label }: ColorPickerProps) =>
  label ? (
    <Field label={label}>
      <Swatches palette={palette} value={value} onChange={onChange} />
    </Field>
  ) : (
    <Swatches palette={palette} value={value} onChange={onChange} />
  );
