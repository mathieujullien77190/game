import { Token, type TokenColor, type TokenType } from "engine/Token/Token"
import type { Set } from "store/types"

export const createTokenActions = (set: Set) => ({
  addToken: (token: Token) =>
    set((state) => {
      state.tokens[token.id] = token
      return { revision: state.revision + 1 }
    }),

  removeToken: (id: string) =>
    set((state) => {
      const tokens = { ...state.tokens }
      delete tokens[id]
      return { tokens, revision: state.revision + 1 }
    }),

  updateToken: (id: string, patch: { color?: TokenColor; speed?: number; type?: TokenType }) =>
    set((state) => {
      const token = state.tokens[id]
      if (!token) return {}
      if (patch.color !== undefined) token.color = patch.color
      if (patch.speed !== undefined) token.speed = patch.speed
      if (patch.type !== undefined) token.type = patch.type
      return { revision: state.revision + 1 }
    }),
})
