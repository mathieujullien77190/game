import type { ReactNode } from "react"

export type Props = {
  title: string
  onBack: () => void
  right?: ReactNode
}
