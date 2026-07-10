import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { NumberInput } from "components/form/NumberInput"
import { Select } from "components/form/Select"
import { Button } from "components/ui/Button"
import { DeleteButton } from "components/ui/DeleteButton"
import { Card } from "components/ui/Card"
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
              <S.Row>
                <S.GateId>{sg.id}</S.GateId>
                <DeleteButton onClick={() => removeScreenGate(sg.id)} />
              </S.Row>
              <Select
                label="Target Screen"
                placeholder="— select —"
                value={sg.targetScreenId}
                options={targetScreenOptions.map((s) => ({ value: s, label: s }))}
                onChange={(v) => updateScreenGateTargetScreen(sg.id, v)}
              />
              {sg.targetScreenId && (
                <S.ScreenTimeRow>
                  <S.Label>Time ×</S.Label>
                  <NumberInput
                    value={screenTimeMultipliers[sg.targetScreenId] ?? 1}
                    min={0.01}
                    step={0.1}
                    commitOn="blur"
                    onChange={(v) => setScreenTimeMultiplier(sg.targetScreenId, v)}
                  />
                </S.ScreenTimeRow>
              )}
              {sg.targetScreenId && (
                <>
                  <Select
                    label="Entry Line"
                    placeholder="— select —"
                    value={sg.entryKey}
                    options={lineOpts}
                    onChange={(v) => updateScreenGateEntryKey(sg.id, v)}
                  />
                  <Select
                    label="Exit Line"
                    placeholder="— select —"
                    value={sg.exitKey}
                    options={lineOpts}
                    onChange={(v) => updateScreenGateExitKey(sg.id, v)}
                  />
                </>
              )}
            </Card>
          )
        })}
      </S.GateList>
    </S.Container>
  )
}
