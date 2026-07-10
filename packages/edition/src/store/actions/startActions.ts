import { StartEditor } from "@drift/engine/entities/Start/StartEditor"
import { Token, TOKEN_COLORS, type TokenColor, type TokenType } from "@drift/engine/entities/Token/Token"
import type { Set } from "store/types"

export const createStartActions = (set: Set) => ({
  addStart: (start: StartEditor) =>
    set((state) => {
      state.starts[start.id] = start
      return { revision: state.revision + 1 }
    }),

  removeStart: (id: string) =>
    set((state) => {
      const starts = { ...state.starts }
      delete starts[id]
      return { starts, revision: state.revision + 1 }
    }),

  updateStartDelay: (id: string, delay: number) =>
    set((state) => {
      const s = state.starts[id]
      if (!s) return {}
      return {
        starts: { ...state.starts, [id]: new StartEditor(s.lineId, s.endpoint, delay, s.id, s.screenId, s.firstDelay, s.tokens) },
        revision: state.revision + 1,
      }
    }),

  updateStartFirstDelay: (id: string, firstDelay: number) =>
    set((state) => {
      const s = state.starts[id]
      if (!s) return {}
      return {
        starts: { ...state.starts, [id]: new StartEditor(s.lineId, s.endpoint, s.delay, s.id, s.screenId, firstDelay, s.tokens) },
        revision: state.revision + 1,
      }
    }),

  addTokenToStart: (startId: string) =>
    set((state) => {
      const s = state.starts[startId]
      if (!s) return {}
      const t = new Token(TOKEN_COLORS[0], 40)
      s.tokens = [...s.tokens, { id: t.id, color: t.color as string, type: t.type as string, speed: t.speed }]
      return { revision: state.revision + 1 }
    }),

  removeTokenFromStart: (startId: string, tokenId: string) =>
    set((state) => {
      const s = state.starts[startId]
      if (!s) return {}
      s.tokens = s.tokens.filter((t) => t.id !== tokenId)
      return { revision: state.revision + 1 }
    }),

  updateStartToken: (startId: string, tokenId: string, patch: { color?: TokenColor; speed?: number; type?: TokenType; angled?: boolean }) =>
    set((state) => {
      const s = state.starts[startId]
      if (!s) return {}
      const tok = s.tokens.find((t) => t.id === tokenId)
      if (!tok) return {}
      if (patch.color !== undefined) tok.color = patch.color as string
      if (patch.speed !== undefined) tok.speed = patch.speed
      if (patch.type !== undefined) tok.type = patch.type as string
      if (patch.angled !== undefined) tok.angled = patch.angled
      return { revision: state.revision + 1 }
    }),
})
