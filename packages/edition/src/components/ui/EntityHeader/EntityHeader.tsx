import { DeleteButton } from "components/ui/DeleteButton"
import { Tag } from "components/ui/Tag"
import * as S from "./UI"
import type { Props } from "./types"

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
