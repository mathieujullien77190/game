import type { StoreApi } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LineEditor } from "engine/Line/LineEditor"
import type { LineType } from "engine/Line/Line"
import { Token } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import type { Rotator } from "engine/Rotator/Rotator"
import type { Painter } from "engine/Painter/Painter"
import type { Point } from "engine/types"

export type Mode = "select" | "addLine" | "addStart" | "addSwitch" | "addRotator" | "addPainter"
export type ViewMode = "editor" | "preview"

export interface StoreState {
  editorManager: EditorManager
  previewManager: PreviewManager
  tokens: Record<string, Token>
  starts: Record<string, StartEditor>
  switches: Record<string, SwitchEditor>
  switchLinks: Record<string, string[]>
  rotators: Record<string, Rotator>
  painters: Record<string, Painter>
  hoveredLineId: string | null
  hoveredSwitchId: string | null
  hoveredRotatorId: string | null
  hoveredPainterId: string | null
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
  addPainter: (linkId: string) => void
  removePainter: (id: string) => void
  setPainterColor: (id: string, color: string) => void
  setHoveredPainterId: (id: string | null) => void
  setHoveredSwitchId: (id: string | null) => void
  setHoveredLineId: (id: string | null) => void
  setMode: (mode: Mode) => void
  setViewMode: (viewMode: ViewMode) => void
  setPendingPoint: (point: Point | null) => void
  setLineType: (lineType: LineType) => void
}

export type Store = StoreState & StoreActions

export type Set = StoreApi<Store>["setState"]
