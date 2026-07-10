import { Field } from "components/form/Field"
import * as S from "./UI"

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  label?: string
}

export const Select = ({ value, onChange, options, placeholder, label }: Props) => {
  const select = (
    <S.StyledSelect value={value} onChange={(e) => onChange(e.target.value)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </S.StyledSelect>
  )

  if (!label) return select

  return <Field label={label}>{select}</Field>
}
