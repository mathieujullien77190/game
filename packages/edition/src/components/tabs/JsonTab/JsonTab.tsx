import { useShallow } from "zustand/react/shallow"
import { useStore } from "store"
import { serializeMap } from "@drift/engine/Map/mapJson"
import { EMPTY_MAP } from "store/actions/mapActions"
import * as S from "./UI"

export const JsonTab = () => {
  const { editorManager, starts, switches, switchLinks, revision, loadMap, mapName, availableMaps, switchMap, createMap } = useStore(
    useShallow((s) => ({
      editorManager: s.editorManager,
      starts: s.starts,
      switches: s.switches,
      switchLinks: s.switchLinks,
      revision: s.revision,
      loadMap: s.loadMap,
      mapName: s.mapName,
      availableMaps: s.availableMaps,
      switchMap: s.switchMap,
      createMap: s.createMap,
    }))
  )

  const { transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers } = useStore(
    useShallow((s) => ({ transformers: s.transformers, inverters: s.inverters, arrival: s.arrival, screens: s.screens, screenGates: s.screenGates, screenTimeMultipliers: s.screenTimeMultipliers }))
  )

  const json = JSON.stringify(serializeMap(editorManager, starts, switches, switchLinks, transformers, arrival, inverters, screens, screenGates, screenTimeMultipliers), null, 2)

  return (
    <S.Container>
      <S.MapRow>
        {availableMaps.map((name) => (
          <S.MapButton key={name} $active={name === mapName} onClick={() => switchMap(name)}>
            {name}
          </S.MapButton>
        ))}
        <S.NewMapButton onClick={() => createMap()}>+ New Map</S.NewMapButton>
      </S.MapRow>
      <S.ButtonRow>
        <S.ClearButton onClick={() => loadMap(EMPTY_MAP)}>Clear map</S.ClearButton>
        <S.CopyButton onClick={() => navigator.clipboard.writeText(json)}>Copy</S.CopyButton>
      </S.ButtonRow>
      <S.Pre key={revision}>{json}</S.Pre>
    </S.Container>
  )
}
