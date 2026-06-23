import { create } from "zustand"
import { persist } from "zustand/middleware"
import { EditorManager } from "engine/Manager/EditorManager"
import { PreviewManager } from "engine/Manager/PreviewManager"
import { LineEditor } from "engine/Line/LineEditor"
import { syncLineCounter, type LineType } from "engine/Line/Line"
import { Token, syncTokenCounter, type TokenColor, type TokenType } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { syncStartCounter } from "engine/Start/Start"
import type { Store } from "./types"
import type { Point } from "engine/types"
import { createLineActions } from "./actions/lineActions"
import { createLinkActions } from "./actions/linkActions"
import { createTokenActions } from "./actions/tokenActions"
import { createModeActions } from "./actions/modeActions"
import { createStartActions } from "./actions/startActions"

type PersistedState = {
  lines: { id: string; start: Point; end: Point; type?: LineType; cp1?: Point; cp2?: Point }[]
  links: { id: string; activated: boolean }[]
  tokens: { id: string; color: TokenColor; speed: number; type?: TokenType }[]
  starts: { id: string; lineId: string; endpoint: "start" | "end"; delay: number }[]
}

const editorManager = new EditorManager()
const previewManager = new PreviewManager()
;(window as any).previewManager = previewManager

export const useStore = create<Store>()(
  persist(
    (set) => ({
      editorManager,
      previewManager,
      tokens: {},
      starts: {},
      revision: 0,
      mode: "select",
      viewMode: "editor",
      pendingPoint: null,
      lineType: "straight" as LineType,
      ...createLineActions(set),
      ...createLinkActions(set),
      ...createTokenActions(set),
      ...createModeActions(set),
      ...createStartActions(set),
    }),
    {
      name: "game2-store",
      partialize: (state) => ({
        lines: Object.values(state.editorManager.data.lines).map((l) => ({
          id: l.id,
          start: l.start,
          end: l.end,
          type: l.type,
          cp1: l.cp1,
          cp2: l.cp2,
        })),
        links: Object.values(state.editorManager.data.links).map((lk) => ({
          id: lk.id,
          activated: lk.activated,
        })),
        tokens: Object.values(state.tokens).map((t) => ({
          id: t.id,
          color: t.color,
          speed: t.speed,
          type: t.type,
        })),
        starts: Object.values(state.starts).map((s) => ({
          id: s.id,
          lineId: s.lineId,
          endpoint: s.endpoint,
          delay: s.delay,
        })),
      }),
      merge: (persisted, current) => {
        const p = persisted as PersistedState

        if (p.lines?.length) {
          p.lines.forEach(({ id, start, end, type, cp1, cp2 }) => {
            current.editorManager.addLine(new LineEditor(start, end, type ?? "straight", id, cp1, cp2))
          })
          syncLineCounter(p.lines.map((l) => l.id))
        }

        if (p.links?.length) {
          p.links.forEach(({ id, activated }) => {
            const link = current.editorManager.data.links[id]
            if (link) link.activated = activated
          })
        }

        const tokens: Record<string, Token> = {}
        if (p.tokens?.length) {
          p.tokens.forEach(({ id, color, speed, type }) => {
            const token = new Token(color, speed, id, type ?? "round")
            tokens[token.id] = token
          })
          syncTokenCounter(Object.keys(tokens))
        }

        const starts: Record<string, StartEditor> = {}
        if (p.starts?.length) {
          p.starts.forEach(({ id, lineId, endpoint, delay }) => {
            const s = new StartEditor(lineId, endpoint, delay, id)
            starts[s.id] = s
          })
          syncStartCounter(Object.keys(starts))
        }

        return { ...current, tokens, starts, revision: 1 }
      },
    }
  )
)
