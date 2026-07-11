import type { ReactNode } from "react"

export type Props = {
  children: ReactNode
  screenId?: string
  onDelete: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}
