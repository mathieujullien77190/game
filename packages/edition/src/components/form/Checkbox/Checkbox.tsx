import * as S from "./UI"

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Checkbox = ({ checked, onChange }: Props) => (
  <S.StyledCheckbox checked={checked} onChange={(e) => onChange(e.target.checked)} />
)
