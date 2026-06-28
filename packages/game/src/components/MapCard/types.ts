export type Props = {
  num: number
  locked: boolean
  accent: string
  label: string
  result?: { stars: number; bestTime: number }
  onClick: () => void
}
