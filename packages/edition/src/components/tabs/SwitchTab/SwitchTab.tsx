import { useShallow } from "zustand/react/shallow"
import { TOKEN_COLORS } from "@drift/engine/entities/Token/Token"
import type { SwitchMode } from "@drift/engine/entities/Switch/Switch"
import { ColorPicker } from "components/form/ColorPicker"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { Box } from "components/ui/Box"
import { useStore } from "store"
import { getSwitchEnterPoint } from "@drift/engine/entities/Switch/switchUtils"
import * as S from "./UI"

const SWITCH_ACCENT = "#333"

const SWITCH_COLORS = ["#ccc", ...TOKEN_COLORS] as const
const SWITCH_MODES: SwitchMode[] = ["manual", "auto"]

export const SwitchTab = () => {
  const {
    switches, switchLinks, editorManager, revision: _revision,
    mode, currentScreenId, setMode, removeSwitch, updateSwitchActiveLink, updateSwitchLinks, updateSwitchColor, updateSwitchMode, toggleSwitchLink, setHoveredSwitchId,
  } = useStore(
    useShallow((s) => ({
      switches: s.switches,
      switchLinks: s.switchLinks,
      editorManager: s.editorManager,
      revision: s.revision,
      mode: s.mode,
      currentScreenId: s.currentScreenId,
      setMode: s.setMode,
      removeSwitch: s.removeSwitch,
      updateSwitchActiveLink: s.updateSwitchActiveLink,
      updateSwitchLinks: s.updateSwitchLinks,
      updateSwitchColor: s.updateSwitchColor,
      updateSwitchMode: s.updateSwitchMode,
      toggleSwitchLink: s.toggleSwitchLink,
      setHoveredSwitchId: s.setHoveredSwitchId,
    }))
  )

  const isPlacing = mode === "addSwitch"
  const switchesForScreen = Object.values(switches).filter((sw) => sw.screenId === currentScreenId)

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={SWITCH_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addSwitch")}>
        {isPlacing ? "Cancel" : "+ Add Switch"}
      </Button>

      <S.SwitchList>
        {switchesForScreen.map((sw) => {
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
            <Box
              key={sw.id}
              id={sw.id}
              screenId={sw.screenId}
              onDelete={() => removeSwitch(sw.id)}
              onMouseEnter={() => setHoveredSwitchId(sw.id)}
              onMouseLeave={() => setHoveredSwitchId(null)}
            >
              <Field label="color" $direction="row">
                <ColorPicker
                  palette={SWITCH_COLORS}
                  value={sw.color}
                  onChange={(color) => updateSwitchColor(sw.id, color)}
                />
              </Field>

              <Field label="mode" $direction="row">
                <ToggleGroup $wrap>
                  {SWITCH_MODES.map((m) => (
                    <Button
                      key={m}
                      $size="sm"
                      $accent={SWITCH_ACCENT}
                      $active={sw.mode === m}
                      onClick={() => updateSwitchMode(sw.id, m)}
                    >
                      {m}
                    </Button>
                  ))}
                </ToggleGroup>
              </Field>
              {sw.mode === "auto" && (
                <S.NoLinks>auto : couleur du token en priorité, sinon ligne grise</S.NoLinks>
              )}

              <Field label="enter" $direction="row">
                <ToggleGroup $wrap>
                  {junctionEndpoints.map(({ lineId, endpoint }) => {
                    const key = `${lineId}::${endpoint}`
                    const isActive = ep?.lineId === lineId && ep?.endpoint === endpoint
                    return (
                      <Button
                        key={key}
                        $size="sm"
                        $accent={SWITCH_ACCENT}
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
                      </Button>
                    )
                  })}
                </ToggleGroup>
              </Field>

              {ep && sw.mode !== "auto" && (
                <Field label="active output" $direction="row">
                  {sw.linkIds.length === 0 ? (
                    <S.NoLinks>no links at enter endpoint</S.NoLinks>
                  ) : (
                    <ToggleGroup $wrap>
                      {sw.linkIds.map((lkId) => {
                        const lk = links[lkId]
                        if (!lk) return null
                        const other =
                          lk.line1.lineId === ep.lineId && lk.line1.endpoint === ep.endpoint
                            ? lk.line2
                            : lk.line1
                        return (
                          <Button
                            key={lkId}
                            $size="sm"
                            $accent={SWITCH_ACCENT}
                            $active={sw.activeLinkId === lkId}
                            onClick={() => updateSwitchActiveLink(sw.id, lkId)}
                          >
                            {other.lineId} [{other.endpoint}]
                          </Button>
                        )
                      })}
                    </ToggleGroup>
                  )}
                </Field>
              )}

              {otherSwitches.length > 0 && (
                <Field label="linked switches" $direction="row">
                  <ToggleGroup $wrap>
                    {otherSwitches.map((other) => (
                      <Button
                        key={other.id}
                        $size="sm"
                        $accent={SWITCH_ACCENT}
                        $active={linkedIds.has(other.id)}
                        onClick={() => toggleSwitchLink(sw.id, other.id)}
                      >
                        {other.id}
                      </Button>
                    ))}
                  </ToggleGroup>
                </Field>
              )}
            </Box>
          )
        })}
      </S.SwitchList>
    </S.Container>
  )
}
