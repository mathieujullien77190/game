import { useShallow } from "zustand/react/shallow"
import { getSwitchEnterPoint } from "@drift/engine/entities/Switch/switchUtils"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { Box } from "components/ui/Box"
import { useStore } from "store"
import * as S from "./UI"

const CLONER_ACCENT = "#333"

export const ClonerTab = () => {
  const { cloners, editorManager, revision: _revision, mode, currentScreenId, setMode, removeCloner, updateClonerLinks, setHoveredClonerId } = useStore(
    useShallow((s) => ({
      cloners: s.cloners,
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeCloner: s.removeCloner,
      updateClonerLinks: s.updateClonerLinks,
      setHoveredClonerId: s.setHoveredClonerId,
    }))
  )

  const isPlacing = mode === "addCloner"
  const clonersForScreen = Object.values(cloners).filter((cl) => cl.screenId === currentScreenId)

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={CLONER_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addCloner")}>
        {isPlacing ? "Cancel" : "+ Add Cloner"}
      </Button>
      <S.ClonerList>
        {clonersForScreen.map((cl) => {
          const links = editorManager.data.links
          const ep = getSwitchEnterPoint(cl.linkIds, links)

          const otherEndpoints = cl.linkIds
            .map((lkId) => {
              const lk = links[lkId]
              if (!lk || !ep) return null
              return lk.line1.lineId === ep.lineId && lk.line1.endpoint === ep.endpoint
                ? lk.line2
                : lk.line1
            })
            .filter(Boolean) as { lineId: string; endpoint: "start" | "end" }[]

          const junctionEndpoints = ep ? [ep, ...otherEndpoints] : otherEndpoints

          return (
            <Box
              key={cl.id}
              id={cl.id}
              screenId={cl.screenId}
              onDelete={() => removeCloner(cl.id)}
              onMouseEnter={() => setHoveredClonerId(cl.id)}
              onMouseLeave={() => setHoveredClonerId(null)}
            >
              <Field label="enter" $direction="row">
                {junctionEndpoints.length === 0 ? (
                  <S.NoLinks>no links</S.NoLinks>
                ) : (
                  <ToggleGroup $wrap>
                    {junctionEndpoints.map(({ lineId, endpoint }) => {
                      const key = `${lineId}::${endpoint}`
                      const isActive = ep?.lineId === lineId && ep?.endpoint === endpoint
                      return (
                        <Button
                          key={key}
                          $size="sm"
                          $accent={CLONER_ACCENT}
                          $active={isActive}
                          onClick={() => {
                            if (isActive) return
                            const newLinkIds = Object.values(links)
                              .filter((lk) =>
                                (lk.line1.lineId === lineId && lk.line1.endpoint === endpoint) ||
                                (lk.line2.lineId === lineId && lk.line2.endpoint === endpoint)
                              )
                              .map((lk) => lk.id)
                            updateClonerLinks(cl.id, newLinkIds)
                          }}
                        >
                          {lineId} [{endpoint}]
                        </Button>
                      )
                    })}
                  </ToggleGroup>
                )}
              </Field>
            </Box>
          )
        })}
      </S.ClonerList>
    </S.Container>
  )
}
