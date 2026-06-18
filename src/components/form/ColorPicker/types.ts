export type ColorPickerProps = {
  palette: readonly string[];
  value: string;
  onChange: (color: string) => void;
  label?: string;
};
