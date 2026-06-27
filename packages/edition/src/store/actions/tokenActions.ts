import { Token, type TokenColor, type TokenType } from "engine/Token/Token"
import type { Set } from "store/types"

export const createTokenActions = (set: Set) => ({
  addToken: (token: Token) =>
    set((state) => ({
      tokens: { ...state.tokens, [token.id]: token },
      revision: state.revision + 1,
    })),

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
      const updated = new Token(
        patch.color ?? token.color,
        patch.speed ?? token.speed,
        token.id,
        patch.type ?? token.type,
      )
      return { tokens: { ...state.tokens, [id]: updated }, revision: state.revision + 1 }
    }),
})
