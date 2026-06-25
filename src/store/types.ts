import type { StoreApi } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LineEditor } from "engine/Line/LineEditor"
import type { LineType } from "engine/Line/Line"
import { Token } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import type { Rotator } from "engine/Rotator/Rotator"
import type { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import type { Fader } from "engine/Fader/Fader"
import type { Inverter } from "engine/Inverter/Inverter"
import type { Transformer } from "engine/Transformer/Transformer"
import type { Point } from "engine/types"

export type Mode = "select" | "addLine" | "addStart" | "addSwitch" | "addRotator" | "addArrival" | "addFader" | "addInverter" | "addTransformer"
export type ViewMode = "editor" | "preview"

export interface StoreState {
  editorManager: EditorManager
  previewManager: PreviewManager
  tokens: Record<string, Token>
  starts: Record<string, StartEditor>
  switches: Record<string, SwitchEditor>
  switchLinks: Record<string, string[]>
  rotators: Record<string, Rotator>
  faders: Record<string, Fader>
  inverters: Record<string, Inverter>
  transformers: Record<string, Transformer>
  arrival: ArrivalEditor | null
  hoveredLineId: string | null
  hoveredSwitchId: string | null
  hoveredRotatorId: string | null
  hoveredFaderId: string | null
  hoveredInverterId: string | null
  hoveredTransformerId: string | null
  revision: number
  mode: Mode
  viewMode: ViewMode
  pendingPoint: Point | null
  lineType: LineType
}

export interface StoreActions {
  addLine: (line: LineEditor) => void
  removeLine: (id: string) => void
  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) => void
  updateLineControlPoint: (id: string, cp: "cp1" | "cp2", point: Point) => void
  updateLineBoost: (id: string, boost: number) => void
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
  addRotator: (linkId: string) => void
  removeRotator: (id: string) => void
  setHoveredRotatorId: (id: string | null) => void
  addFader: (linkId: string) => void
  removeFader: (id: string) => void
  setHoveredFaderId: (id: string | null) => void
  updateFaderAmount: (id: string, amount: number) => void
  addInverter: (linkId: string) => void
  removeInverter: (id: string) => void
  setHoveredInverterId: (id: string | null) => void
  addTransformer: (linkId: string) => void
  removeTransformer: (id: string) => void
  setHoveredTransformerId: (id: string | null) => void
  updateTransformerTargetType: (id: string, targetType: string) => void
  updateTransformerColor: (id: string, color: string) => void
  updateTransformerMode: (id: string, mode: "color" | "shape") => void
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
}

export type Store = StoreState & StoreActions

export type Set = StoreApi<Store>["setState"]
