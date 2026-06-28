import styled from "styled-components"

const Wrap = styled.div`
  display: flex;
  gap: 3px;
`

const Btn = styled.button<{ $active: boolean }>`
  padding: 2px 7px;
  font-size: 11px;
  border: 1px solid ${({ $active }) => ($active ? "#333" : "#ccc")};
  border-radius: 3px;
  background: ${({ $active }) => ($active ? "#333" : "#f5f5f5")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  cursor: pointer;
  &:hover { background: ${({ $active }) => ($active ? "#555" : "#e8e8e8")}; }
`

type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  options: Option<T>[]
  value: T | ""
  onChange: (value: T | "") => void
}

export const ToggleGroup = <T extends string>({ options, value, onChange }: Props<T>) => (
  <Wrap>
    {options.map((opt) => (
      <Btn
        key={opt.value}
        $active={value === opt.value}
        onClick={() => onChange(value === opt.value ? "" : opt.value)}
      >
        {opt.label}
      </Btn>
    ))}
  </Wrap>
)
