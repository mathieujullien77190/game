import type { StoreApi } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LineEditor } from "engine/Line/LineEditor"
import type { LineType } from "engine/Line/Line"
import { Token } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import type { Transformer, TransformerType } from "engine/Transformer/Transformer"
import type { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import type { Inverter } from "engine/Inverter/Inverter"
import type { ScreenGate } from "engine/ScreenGate/ScreenGate"
import type { Point } from "engine/types"

export type Mode = "select" | "addLine" | "addStart" | "addSwitch" | "addTransformer" | "addArrival" | "addInverter" | "addScreenGate"
export type ViewMode = "editor" | "preview"

export interface StoreState {
  editorManager: EditorManager
  previewManager: PreviewManager
  tokens: Record<string, Token>
  starts: Record<string, StartEditor>
  switches: Record<string, SwitchEditor>
  switchLinks: Record<string, string[]>
  transformers: Record<string, Transformer>
  inverters: Record<string, Inverter>
  arrival: ArrivalEditor | null
  hoveredLineId: string | null
  hoveredSwitchId: string | null
  hoveredTransformerId: string | null
  hoveredInverterId: string | null
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
}

export interface StoreActions {
  addLine: (line: LineEditor) => void
  removeLine: (id: string) => void
  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) => void
  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) => void
  updateLineBoost: (id: string, boost: number) => void
  updateLineTunnel: (id: string, tunnel: boolean) => void
  updateLineSine: (id: string, frequency: number, amplitude: number) => void
  toggleLinkActivated: (linkId: string) => void
  addToken: (token: Token) => void
  removeToken: (id: string) => void
  updateToken: (id: string, patch: { color?: string; speed?: number; type?: string }) => void
  addStart: (start: StartEditor) => void
  removeStart: (id: string) => void
  updateStartDelay: (id: string, delay: number) => void
  addSwitch: (sw: SwitchEditor) => void
  removeSwitch: (id: string) => void
  updateSwitchActiveLink: (id: string, activeLinkId: string) => void
  updateSwitchLinks: (id: string, linkIds: string[], activeLinkId: string | null) => void
  toggleSwitchLink: (id1: string, id2: string) => void
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
  setHoveredInverterId: (id: string | null) => void
  setArrival: (lineId: string, endpoint: "start" | "end") => void
  removeArrival: () => void
  addArrivalDemand: () => void
  removeArrivalDemand: (id: string) => void
  updateArrivalDemand: (id: string, patch: { color?: string; type?: string; angled?: boolean }) => void
  setHoveredSwitchId: (id: string | null) => void
  setHoveredLineId: (id: string | null) => void
  setMode: (mode: Mode) => void
  setViewMode: (viewMode: ViewMode) => void
  setPendingPoint: (point: Point | null) => void
  setLineType: (lineType: LineType) => void
  setLinePreset: (preset: "arc" | null) => void
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
