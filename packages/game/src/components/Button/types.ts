import type { ReactNode } from "react"

export type Props = {
  variant?: "primary" | "secondary"
  onClick?: () => void
  children: ReactNode
}
