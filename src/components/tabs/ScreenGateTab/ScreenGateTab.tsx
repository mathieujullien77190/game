import { useState, useEffect } from "react"
import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import * as S from "./UI"

const MultiplierField = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [local, setLocal] = useState(String(value))

  useEffect(() => { setLocal(String(value)) }, [value])

  return (
    <S.MultiplierInput
      type="number"
      min={0.01}
      step={0.1}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        const v = parseFloat(local)
        if (!isNaN(v) && v > 0) onChange(v)
        else setLocal(String(value))
      }}
    />
  )
}

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
      <S.AddButton $active={isPlacing} onClick={() => setMode(isPlacing ? "select" : "addScreenGate")}>
        {isPlacing ? "Cancel" : "+ Add Gate"}
      </S.AddButton>
      <S.GateList>
        {gatesForScreen.map((sg) => {
          const lineOpts = getLineOptions(sg.targetScreenId)
          return (
            <S.GateCard
              key={sg.id}
              onMouseEnter={() => setHoveredScreenGateId(sg.id)}
              onMouseLeave={() => setHoveredScreenGateId(null)}
            >
              <S.Row>
                <S.GateId>{sg.id}</S.GateId>
                <S.DeleteButton onClick={() => removeScreenGate(sg.id)}>✕</S.DeleteButton>
              </S.Row>
              <div>
                <S.Label>Target Screen</S.Label>
                <S.Select
                  value={sg.targetScreenId}
                  onChange={(e) => updateScreenGateTargetScreen(sg.id, e.target.value)}
                >
                  <option value="">— select —</option>
                  {targetScreenOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </S.Select>
              </div>
              {sg.targetScreenId && (
                <S.ScreenTimeRow>
                  <S.Label>Time ×</S.Label>
                  <MultiplierField
                    value={screenTimeMultipliers[sg.targetScreenId] ?? 1}
                    onChange={(v) => setScreenTimeMultiplier(sg.targetScreenId, v)}
                  />
                </S.ScreenTimeRow>
              )}
              {sg.targetScreenId && (
                <>
                  <div>
                    <S.Label>Entry Line</S.Label>
                    <S.Select
                      value={sg.entryKey}
                      onChange={(e) => updateScreenGateEntryKey(sg.id, e.target.value)}
                    >
                      <option value="">— select —</option>
                      {lineOpts.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </S.Select>
                  </div>
                  <div>
                    <S.Label>Exit Line</S.Label>
                    <S.Select
                      value={sg.exitKey}
                      onChange={(e) => updateScreenGateExitKey(sg.id, e.target.value)}
                    >
                      <option value="">— select —</option>
                      {lineOpts.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </S.Select>
                  </div>
                </>
              )}
            </S.GateCard>
          )
        })}
      </S.GateList>
    </S.Container>
  )
}
