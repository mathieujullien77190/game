import type { StoreApi } from "zustand"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LineEditor } from "engine/Line/LineEditor"
import { Token } from "engine/Token/Token"
import { Start } from "engine/Start/Start"
import type { Point } from "engine/types"

export type Mode = "select" | "addLine" | "addStart"
export type ViewMode = "editor" | "preview"

export interface StoreState {
  editorManager: EditorManager
  previewManager: PreviewManager
  tokens: Record<string, Token>
  start: Start | null
  revision: number
  mode: Mode
  viewMode: ViewMode
  pendingPoint: Point | null
}

export interface StoreActions {
  addLine: (line: LineEditor) => void
  removeLine: (id: string) => void
  updateLineEndpoint: (id: string, endpoint: "start" | "end", point: Point) => void
  toggleLinkActivated: (linkId: string) => void
  addToken: (token: Token) => void
  removeToken: (id: string) => void
  updateToken: (id: string, patch: { color?: string; speed?: number; type?: string }) => void
  setStart: (start: Start | null) => void
  updateStartDelay: (delay: number) => void
  setMode: (mode: Mode) => void
  setViewMode: (viewMode: ViewMode) => void
  setPendingPoint: (point: Point | null) => void
}

export type Store = StoreState & StoreActions

export type Set = StoreApi<Store>["setState"]
