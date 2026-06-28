import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { getSwitchEnterPoint } from "engine/Switch/switchUtils"
import { TOKEN_COLORS } from "engine/Token/Token"
import { ColorPicker } from "components/form/ColorPicker"
import * as S from "./UI"

export const SwitchTab = () => {
  const {
    switches, switchLinks, editorManager, revision: _revision,
    mode, setMode, removeSwitch, updateSwitchActiveLink, updateSwitchLinks,
    updateSwitchColor, toggleSwitchLink, setHoveredSwitchId,
  } = useStore(
    useShallow((s) => ({
      switches: s.switches,
      switchLinks: s.switchLinks,
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      setMode: s.setMode,
      removeSwitch: s.removeSwitch,
      updateSwitchActiveLink: s.updateSwitchActiveLink,
      updateSwitchLinks: s.updateSwitchLinks,
      updateSwitchColor: s.updateSwitchColor,
      toggleSwitchLink: s.toggleSwitchLink,
      setHoveredSwitchId: s.setHoveredSwitchId,
    }))
  )

  const isPlacing = mode === "addSwitch"

  return (
    <S.Container>
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addSwitch")}>
        {isPlacing ? "Cancel" : "+ Add Switch"}
      </S.AddButton>

      <S.SwitchList>
        {Object.values(switches).map((sw) => {
          const links = editorManager.data.links
          const ep = getSwitchEnterPoint(sw.linkIds, links)

          const otherEndpoints = sw.linkIds
            .map((lkId) => {
              const lk = links[lkId]
              if (!lk || !ep) return null
              return lk.line1.lineId === ep.lineId && lk.line1.endpoint === ep.endpoint
                ? lk.line2
                : lk.line1
            })
            .filter(Boolean) as { lineId: string; endpoint: "start" | "end" }[]

          const junctionEndpoints = ep ? [ep, ...otherEndpoints] : otherEndpoints

          const otherSwitches = Object.values(switches).filter((s) => s.id !== sw.id)
          const linkedIds = new Set(switchLinks[sw.id] ?? [])

          return (
            <S.SwitchCard
              key={sw.id}
              onMouseEnter={() => setHoveredSwitchId(sw.id)}
              onMouseLeave={() => setHoveredSwitchId(null)}
            >
              <S.Row>
                <S.SwitchId>{sw.id}</S.SwitchId>
                <S.DeleteButton onClick={() => removeSwitch(sw.id)}>✕</S.DeleteButton>
              </S.Row>

              <S.Divider />
              <S.Label>color</S.Label>
              <ColorPicker
                palette={TOKEN_COLORS}
                value={sw.color}
                onChange={(c) => updateSwitchColor(sw.id, c)}
              />

              <S.Divider />
              <S.Label>enter</S.Label>
              <S.OutputList>
                {junctionEndpoints.map(({ lineId, endpoint }) => {
                  const key = `${lineId}::${endpoint}`
                  const isActive = ep?.lineId === lineId && ep?.endpoint === endpoint
                  return (
                    <S.OutputOption
                      key={key}
                      $active={isActive}
                      onClick={() => {
                        if (isActive) return
                        const newLinkIds = Object.values(links)
                          .filter((lk) =>
                            (lk.line1.lineId === lineId && lk.line1.endpoint === endpoint) ||
                            (lk.line2.lineId === lineId && lk.line2.endpoint === endpoint)
                          )
                          .map((lk) => lk.id)
                        updateSwitchLinks(sw.id, newLinkIds, newLinkIds[0] ?? null)
                      }}
                    >
                      {lineId} [{endpoint}]
                    </S.OutputOption>
                  )
                })}
              </S.OutputList>

              {ep && (
                <>
                  <S.Divider />
                  <S.Label>active output</S.Label>
                  {sw.linkIds.length === 0 ? (
                    <S.NoLinks>no links at enter endpoint</S.NoLinks>
                  ) : (
                    <S.OutputList>
                      {sw.linkIds.map((lkId) => {
                        const lk = links[lkId]
                        if (!lk) return null
                        const other =
                          lk.line1.lineId === ep.lineId && lk.line1.endpoint === ep.endpoint
                            ? lk.line2
                            : lk.line1
                        return (
                          <S.OutputOption
                            key={lkId}
                            $active={sw.activeLinkId === lkId}
                            onClick={() => updateSwitchActiveLink(sw.id, lkId)}
                          >
                            {other.lineId} [{other.endpoint}]
                          </S.OutputOption>
                        )
                      })}
                    </S.OutputList>
                  )}
                </>
              )}

              {otherSwitches.length > 0 && (
                <>
                  <S.Divider />
                  <S.Label>linked switches</S.Label>
                  <S.OutputList>
                    {otherSwitches.map((other) => (
                      <S.OutputOption
                        key={other.id}
                        $active={linkedIds.has(other.id)}
                        onClick={() => toggleSwitchLink(sw.id, other.id)}
                      >
                        {other.id}
                      </S.OutputOption>
                    ))}
                  </S.OutputList>
                </>
              )}
            </S.SwitchCard>
          )
        })}
      </S.SwitchList>
    </S.Container>
  )
}
