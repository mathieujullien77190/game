import { useState } from "react"
import { Card } from "components/ui/Card"
import { Divider } from "components/ui/Divider"
import { EntityHeader } from "components/ui/EntityHeader"
import * as S from "./UI"
import type { Props } from "./types"

export const Box = ({
  id, leading, tags, screenId, onDelete, nested, onMouseEnter, onMouseLeave, defaultCollapsed = false, children,
}: Props) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <Card $nested={nested} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <EntityHeader
        screenId={screenId}
        onDelete={onDelete}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      >
        {leading}
        <S.Id>{id}</S.Id>
        {tags}
      </EntityHeader>
      {!collapsed && children && (
        <>
          <Divider />
          {children}
        </>
      )}
    </Card>
  )
}
