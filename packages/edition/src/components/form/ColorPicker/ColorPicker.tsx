import * as S from "./UI"

interface Props {
  palette: readonly string[]
  value: string
  onChange: (color: string) => void
}

export const ColorPicker = ({ palette, value, onChange }: Props) => (
  <S.Palette>
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
