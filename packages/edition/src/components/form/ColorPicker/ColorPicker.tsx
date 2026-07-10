import * as S from "./UI"

interface Props {
  palette: readonly string[]
  value: string
  onChange: (color: string) => void
  onClear?: () => void
}

export const ColorPicker = ({ palette, value, onChange, onClear }: Props) => (
  <S.Palette>
    {onClear && (
      <S.NoneSwatch $selected={!value} onClick={onClear} title="no color" />
    )}
    {palette.map((color) => (
      <S.Swatch
        key={color}
        $color={color}
        $selected={value === color}
        onClick={() => onChange(color)}
      />
    ))}
  </S.Palette>
)
