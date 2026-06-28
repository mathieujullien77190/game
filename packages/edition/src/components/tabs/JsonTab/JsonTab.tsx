import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { serializeMap } from "engine/mapJson"
import type { MapDifficulty } from "store/types"
import * as S from "./UI"

const DIFFICULTIES: MapDifficulty[] = ["Tutorial", "Beginner", "Advanced", "Expert", "Hidden"]

export const JsonTab = () => {
  const {
    editorManager, tokens, starts, switches, switchLinks, transformers, inverters,
    arrival, screens, screenGates, screenTimeMultipliers, helps,
    mapList, currentMapId, mapDifficulties, mapStarThresholds, revision,
    addMap, selectMap, clearCurrentMap, setMapDifficulty, setMapStarThresholds,
  } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      tokens: s.tokens,
      starts: s.starts,
      switches: s.switches,
      switchLinks: s.switchLinks,
      transformers: s.transformers,
      inverters: s.inverters,
      arrival: s.arrival,
      screens: s.screens,
      screenGates: s.screenGates,
      screenTimeMultipliers: s.screenTimeMultipliers,
      helps: s.helps,
      mapList: s.mapList,
      currentMapId: s.currentMapId,
        mapDifficulties: s.mapDifficulties,
      mapStarThresholds: s.mapStarThresholds,
      revision: s.revision,
      addMap: s.addMap,
      selectMap: s.selectMap,
      clearCurrentMap: s.clearCurrentMap,
      setMapDifficulty: s.setMapDifficulty,
      setMapStarThresholds: s.setMapStarThresholds,
    }))
  )

  const currentDifficulty = mapDifficulties[currentMapId] ?? "Tutorial"
  const currentStars = mapStarThresholds[currentMapId] ?? { star1: 180, star2: 120, star3: 60 }

  const handleStarChange = (key: "star1" | "star2" | "star3", val: number) => {
    const updated = { ...currentStars, [key]: val }
    setMapStarThresholds(updated)
    saveWith(mapDifficulties, { ...mapStarThresholds, [currentMapId]: updated })
  }

  const json = JSON.stringify(
    serializeMap(editorManager, tokens, starts, switches, switchLinks, transformers, arrival, inverters, screens, screenGates, screenTimeMultipliers, helps),
    null, 2
  )

  const saveWith = async (diffs: Record<string, string>, stars = mapStarThresholds) => {
    const data = serializeMap(editorManager, tokens, starts, switches, switchLinks, transformers, arrival, inverters, screens, screenGates, screenTimeMultipliers, helps)
    await fetch("/api/save-map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentMapId, data, mapList, mapDifficulties: diffs, mapStarThresholds: stars }),
    })
  }

  const handleSave = () => saveWith(mapDifficulties)

  return (
    <S.Container>
      <S.MapRow>
        {mapList.map((id) => (
          <S.MapChip key={id} $active={id === currentMapId} onClick={() => selectMap(id)}>
            {id}
          </S.MapChip>
        ))}
        <S.AddMapButton onClick={addMap}>+</S.AddMapButton>
      </S.MapRow>
      <S.DiffRow>
        {DIFFICULTIES.map((d) => (
          <S.DiffChip key={d} $active={currentDifficulty === d} onClick={() => {
            setMapDifficulty(d)
            saveWith({ ...mapDifficulties, [currentMapId]: d })
          }}>
            {d}
          </S.DiffChip>
        ))}
      </S.DiffRow>
      <S.StarRow>
        {(["star3", "star2", "star1"] as const).map((key) => (
          <S.StarField key={key}>
            <S.StarLabel>{key === "star3" ? "★★★" : key === "star2" ? "★★" : "★"}</S.StarLabel>
            <S.StarInput
              type="number"
              min={0}
              value={currentStars[key]}
              onChange={(e) => handleStarChange(key, Number(e.target.value))}
            />
            <S.StarUnit>s</S.StarUnit>
          </S.StarField>
        ))}
      </S.StarRow>
      <S.ButtonRow>
        <S.ClearButton onClick={clearCurrentMap}>Clear</S.ClearButton>
        <S.SaveButton onClick={handleSave}>Save</S.SaveButton>
        <S.CopyButton onClick={() => navigator.clipboard.writeText(json)}>Copy</S.CopyButton>
      </S.ButtonRow>
      <S.Pre key={revision}>{json}</S.Pre>
    </S.Container>
  )
}
