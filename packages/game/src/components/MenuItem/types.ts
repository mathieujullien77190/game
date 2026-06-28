import type { ReactNode } from "react"

export type Props = {
  icon: ReactNode
  iconColor: string
  iconBg: string
  title: string
  subtitle?: string
  pill?: string
  pillColor?: string
  pillBg?: string
  right?: ReactNode
  onClick?: () => void
}
