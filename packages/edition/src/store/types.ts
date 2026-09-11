import type { StoreApi } from "zustand"
import { EditorManager } from "@tic-tac-tic/engine/Manager/EditorManager"
import { PreviewManager } from "@tic-tac-tic/engine/Manager/PreviewManager"
import { LineEditor } from "@tic-tac-tic/engine/entities/Line/LineEditor"
import type { LineType, SpeedPos } from "@tic-tac-tic/engine/entities/Line/Line"
import type { TokenColor, TokenType } from "@tic-tac-tic/engine/entities/Token/Token"
import { StartEditor } from "@tic-tac-tic/engine/entities/Start/StartEditor"
import { SwitchEditor } from "@tic-tac-tic/engine/entities/Switch/SwitchEditor"
import type { SwitchMode } from "@tic-tac-tic/engine/entities/Switch/Switch"
import { ClonerEditor } from "@tic-tac-tic/engine/entities/Cloner/ClonerEditor"
import type { Transformer, TransformerType } from "@tic-tac-tic/engine/entities/Transformer/Transformer"
import type { ArrivalEditor } from "@tic-tac-tic/engine/entities/Arrival/ArrivalEditor"
import type { QueueSide } from "@tic-tac-tic/engine/entities/Arrival/Arrival"
import type { Inverter } from "@tic-tac-tic/engine/entities/Inverter/Inverter"
import type { ScreenGate } from "@tic-tac-tic/engine/entities/ScreenGate/ScreenGate"
import type { Point } from "@tic-tac-tic/engine/types"
import type { MapJson } from "@tic-tac-tic/engine/Map/mapJson"

export type Mode = "select" | "addLine" | "addStart" | "addSwitch" | "addTransformer" | "addArrival" | "addInverter" | "addScreenGate" | "addCloner"
export type ViewMode = "editor" | "preview"

export interface StoreState {
  editorManager: EditorManager
  previewManager: PreviewManager
  starts: Record<string, StartEditor>
  switches: Record<string, SwitchEditor>
  switchLinks: Record<string, string[]>
  cloners: Record<string, ClonerEditor>
  transformers: Record<string, Transformer>
  inverters: Record<string, Inverter>
  arrivals: Record<string, ArrivalEditor>
  hoveredLineId: string | null
  hoveredStartId: string | null
  hoveredSwitchId: string | null
  hoveredTransformerId: string | null
  hoveredInverterId: string | null
  hoveredArrivalId: string | null
  hoveredClonerId: string | null
  revision: number
  mode: Mode
  viewMode: ViewMode
  pendingPoint: Point | null
  pendingTransformerType: TransformerType
  lineType: LineType
  linePreset: "arc" | null
  screenGates: Record<string, ScreenGate>
  hoveredScreenGateId: string | null
  screens: string[]
  currentScreenId: string
  screenTimeMultipliers: Record<string, number>
  mapName: string
  availableMaps: string[]
}

export interface StoreActions {
  addLine: (line: LineEditor) => void
  removeLine: (id: string) => void
  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) => void
  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) => void
  toggleLineFlip: (id: string) => void
  updateLineBoost: (id: string, boost: number) => void
  updateLineTunnel: (id: string, tunnel: boolean) => void
  updateLineShowSpeed: (id: string, showSpeed: boolean) => void
  updateLineSpeedPos: (id: string, speedPos: SpeedPos) => void
  updateLineLimitation: (id: string, limitation: number) => void
  updateLineColor: (id: string, color: string | null) => void
  updateLineSine: (id: string, frequency: number, amplitude: number) => void
  updateLineSpiral: (id: string, turns: number) => void
  toggleLinkActivated: (linkId: string) => void
  addStart: (start: StartEditor) => void
  removeStart: (id: string) => void
  updateStartDelay: (id: string, delay: number) => void
  updateStartFirstDelay: (id: string, firstDelay: number) => void
  updateStartFadeLineAfter: (id: string, fadeLineAfter: number) => void
  addTokenToStart: (startId: string) => void
  removeTokenFromStart: (startId: string, tokenId: string) => void
  updateStartToken: (startId: string, tokenId: string, patch: { color?: TokenColor; speed?: number; type?: TokenType; angled?: boolean }) => void
  setHoveredStartId: (id: string | null) => void
  addSwitch: (sw: SwitchEditor) => void
  removeSwitch: (id: string) => void
  updateSwitchActiveLink: (id: string, activeLinkId: string) => void
  updateSwitchLinks: (id: string, linkIds: string[], activeLinkId: string | null) => void
  updateSwitchColor: (id: string, color: string) => void
  updateSwitchMode: (id: string, mode: SwitchMode) => void
  toggleSwitchLink: (id1: string, id2: string) => void
  addCloner: (cl: ClonerEditor) => void
  removeCloner: (id: string) => void
  updateClonerLinks: (id: string, linkIds: string[]) => void
  setHoveredClonerId: (id: string | null) => void
  addTransformer: (linkId: string, type: TransformerType) => void
  removeTransformer: (id: string) => void
  setHoveredTransformerId: (id: string | null) => void
  updateTransformerAmount: (id: string, amount: number) => void
  updateTransformerColor: (id: string, color: string) => void
  updateTransformerTargetType: (id: string, targetType: string) => void
  updateTransformerType: (id: string, type: TransformerType) => void
  setPendingTransformerType: (type: TransformerType) => void
  addInverter: (linkId: string) => void
  removeInverter: (id: string) => void
  updateInverterEffect: (id: string, effect: "invert" | "grayscale" | "dark") => void
  setHoveredInverterId: (id: string | null) => void
  addArrival: (lineId: string, endpoint: "start" | "end") => void
  removeArrival: (id: string) => void
  addArrivalDemand: (arrivalId: string) => void
  removeArrivalDemand: (arrivalId: string, id: string) => void
  updateArrivalDemand: (arrivalId: string, id: string, patch: { color?: TokenColor; type?: TokenType; angled?: boolean }) => void
  setArrivalQueueSide: (arrivalId: string, queueSide: QueueSide) => void
  setHoveredArrivalId: (id: string | null) => void
  setHoveredSwitchId: (id: string | null) => void
  setHoveredLineId: (id: string | null) => void
  setMode: (mode: Mode) => void
  setViewMode: (viewMode: ViewMode) => void
  setPendingPoint: (point: Point | null) => void
  setLineType: (lineType: LineType) => void
  setLinePreset: (preset: "arc" | null) => void
  loadMap: (json: MapJson) => void
  setAvailableMaps: (names: string[]) => void
  switchMap: (name: string) => Promise<void>
  createMap: () => void
  addScreenGate: (linkId: string) => void
  removeScreenGate: (id: string) => void
  setHoveredScreenGateId: (id: string | null) => void
  updateScreenGateTargetScreen: (id: string, targetScreenId: string) => void
  updateScreenGateEntryKey: (id: string, entryKey: string) => void
  updateScreenGateExitKey: (id: string, exitKey: string) => void
  addScreen: () => void
  setCurrentScreen: (id: string) => void
  removeScreen: (id: string) => void
  setScreenTimeMultiplier: (id: string, mult: number) => void
}

export type Store = StoreState & StoreActions

export type Set = StoreApi<Store>["setState"]
