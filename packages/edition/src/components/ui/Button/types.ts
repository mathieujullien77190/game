import type { ReactNode } from "react"

export type Props = {
  children: ReactNode
  onClick: () => void
  $active?: boolean
  $accent?: string
  $full?: boolean
  $size?: "sm" | "md"
}
