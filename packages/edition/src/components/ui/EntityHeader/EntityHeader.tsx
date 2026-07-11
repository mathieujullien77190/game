import type { ReactNode } from "react"
import { DeleteButton } from "components/ui/DeleteButton"
import { Tag } from "components/ui/Tag"
import * as S from "./UI"

interface Props {
  children: ReactNode
  screenId?: string
  onDelete: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export const EntityHeader = ({ children, screenId, onDelete, collapsed = false, onToggleCollapsed }: Props) => (
  <S.Header>
    <S.Left onClick={onToggleCollapsed} $clickable={!!onToggleCollapsed}>
      {onToggleCollapsed && <S.Chevron $open={!collapsed}>▶</S.Chevron>}
      {children}
      {screenId && <Tag>{screenId}</Tag>}
    </S.Left>
    <DeleteButton onClick={onDelete} />
  </S.Header>
)
