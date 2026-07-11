import type { MouseEventHandler, ReactNode } from "react"

export type Props = {
  id: string
  leading?: ReactNode
  tags?: ReactNode
  screenId?: string
  onDelete: () => void
  nested?: boolean
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  defaultCollapsed?: boolean
  children?: ReactNode
}
