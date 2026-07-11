import type { MouseEventHandler, ReactNode } from "react"

export type Props = {
  children: ReactNode
  $accent?: string
  $nested?: boolean
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}
