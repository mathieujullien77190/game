import { useShallow } from "zustand/react/shallow"
import { useToggleSet } from "hooks/useToggleSet"
import { useStore } from "store"
import { NumberInput } from "components/form/NumberInput"
import { Field } from "components/form/Field"
import { Button } from "components/ui/Button"
import { ToggleGroup } from "components/ui/ToggleGroup"
import { EntityHeader } from "components/ui/EntityHeader"
import { Card } from "components/ui/Card"
import { Divider } from "components/ui/Divider"
import * as S from "./UI"

const GATE_ACCENT = "#1a237e"

export const ScreenGateTab = () => {
  const {
    screenGates, revision: _revision, mode, screens, currentScreenId,
    editorManager, screenTimeMultipliers,
    setMode, removeScreenGate, setHoveredScreenGateId,
    updateScreenGateTargetScreen, updateScreenGateEntryKey, updateScreenGateExitKey,
    setScreenTimeMultiplier,
  } = useStore(
    useShallow((s) => ({
      screenGates: s.screenGates,
      revision: s.revision,
      mode: s.mode,
      screens: s.screens,
      currentScreenId: s.currentScreenId,
      editorManager: s.editorManager,
      screenTimeMultipliers: s.screenTimeMultipliers,
      setMode: s.setMode,
      removeScreenGate: s.removeScreenGate,
      setHoveredScreenGateId: s.setHoveredScreenGateId,
      updateScreenGateTargetScreen: s.updateScreenGateTargetScreen,
      updateScreenGateEntryKey: s.updateScreenGateEntryKey,
      updateScreenGateExitKey: s.updateScreenGateExitKey,
      setScreenTimeMultiplier: s.setScreenTimeMultiplier,
    }))
  )

  const isPlacing = mode === "addScreenGate"
  const gatesForScreen = Object.values(screenGates).filter((sg) => sg.screenId === currentScreenId)
  const targetScreenOptions = screens.filter((s) => s !== "main")
  const collapsed = useToggleSet()

  const getLineOptions = (targetScreenId: string) => {
    const lines = Object.values(editorManager.data.lines).filter((l) => l.screenId === targetScreenId)
    const opts: { value: string; label: string }[] = []
    for (const l of lines) {
      opts.push({ value: `${l.id}::start`, label: `${l.id} [start]` })
      opts.push({ value: `${l.id}::end`, label: `${l.id} [end]` })
    }
    return opts
  }

  return (
    <S.Container>
      <Button $active={isPlacing} $accent={GATE_ACCENT} $full onClick={() => setMode(isPlacing ? "select" : "addScreenGate")}>
        {isPlacing ? "Cancel" : "+ Add Gate"}
      </Button>
      <S.GateList>
        {gatesForScreen.map((sg) => {
          const lineOpts = getLineOptions(sg.targetScreenId)
          return (
            <Card
              key={sg.id}
              $accent={GATE_ACCENT}
              onMouseEnter={() => setHoveredScreenGateId(sg.id)}
              onMouseLeave={() => setHoveredScreenGateId(null)}
            >
              <EntityHeader
                screenId={sg.screenId}
                onDelete={() => removeScreenGate(sg.id)}
                collapsed={collapsed.has(sg.id)}
                onToggleCollapsed={() => collapsed.toggle(sg.id)}
              >
                <S.GateId>{sg.id}</S.GateId>
              </EntityHeader>
              {!collapsed.has(sg.id) && (
                <>
                  <Divider />

                  <Field label="Target Screen" $direction="row">
                    {targetScreenOptions.length === 0 ? (
                      <S.NoOptions>no other screen</S.NoOptions>
                    ) : (
                      <ToggleGroup $wrap>
                        {targetScreenOptions.map((s) => (
                          <Button key={s} $size="sm" $accent={GATE_ACCENT} $active={sg.targetScreenId === s} onClick={() => updateScreenGateTargetScreen(sg.id, s)}>
                            {s}
                          </Button>
                        ))}
                      </ToggleGroup>
                    )}
                  </Field>

                  {sg.targetScreenId && (
                    <NumberInput
                      label="Time ×"
                      value={screenTimeMultipliers[sg.targetScreenId] ?? 1}
                      min={0.01}
                      step={0.1}
                      commitOn="blur"
                      onChange={(v) => setScreenTimeMultiplier(sg.targetScreenId, v)}
                    />
                  )}

                  {sg.targetScreenId && (
                    <>
                      <Field label="Entry Line" $direction="row">
                        {lineOpts.length === 0 ? (
                          <S.NoOptions>no lines in target screen</S.NoOptions>
                        ) : (
                          <ToggleGroup $wrap>
                            {lineOpts.map((opt) => (
                              <Button key={opt.value} $size="sm" $accent={GATE_ACCENT} $active={sg.entryKey === opt.value} onClick={() => updateScreenGateEntryKey(sg.id, opt.value)}>
                                {opt.label}
                              </Button>
                            ))}
                          </ToggleGroup>
                        )}
                      </Field>
                      <Field label="Exit Line" $direction="row">
                        {lineOpts.length === 0 ? (
                          <S.NoOptions>no lines in target screen</S.NoOptions>
                        ) : (
                          <ToggleGroup $wrap>
                            {lineOpts.map((opt) => (
                              <Button key={opt.value} $size="sm" $accent={GATE_ACCENT} $active={sg.exitKey === opt.value} onClick={() => updateScreenGateExitKey(sg.id, opt.value)}>
                                {opt.label}
                              </Button>
                            ))}
                          </ToggleGroup>
                        )}
                      </Field>
                    </>
                  )}
                </>
              )}
            </Card>
          )
        })}
      </S.GateList>
    </S.Container>
  )
}
