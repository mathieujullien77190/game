import { Transformer, syncTransformerCounter, type TransformerType } from "engine/Transformer/Transformer"
import { COLOR_TOKEN_RED } from "engine/constants"
import type { Set } from "store/types"

export const createTransformerActions = (set: Set) => ({
  addTransformer: (linkId: string, type: TransformerType, screenId?: string) =>
    set((state) => {
      const tr = new Transformer(linkId, type, undefined, 0.5, COLOR_TOKEN_RED, "square", screenId ?? state.currentScreenId)
      return { transformers: { ...state.transformers, [tr.id]: tr }, revision: state.revision + 1 }
    }),

  removeTransformer: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.transformers
      return { transformers: rest, revision: state.revision + 1 }
    }),

  setHoveredTransformerId: (id: string | null) => set(() => ({ hoveredTransformerId: id })),

  updateTransformerAmount: (id: string, amount: number) =>
    set((state) => {
      const tr = state.transformers[id]
      if (!tr) return {}
      tr.amount = amount
      return { revision: state.revision + 1 }
    }),

  updateTransformerColor: (id: string, color: string) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], color } },
      revision: state.revision + 1,
    })),

  updateTransformerTargetType: (id: string, targetType: string) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], targetType } },
      revision: state.revision + 1,
    })),

  updateTransformerType: (id: string, type: TransformerType) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], type } },
      revision: state.revision + 1,
    })),

  setPendingTransformerType: (type: TransformerType) => set(() => ({ pendingTransformerType: type })),
})

export const syncTransformers = (transformers: Record<string, Transformer>) => {
  syncTransformerCounter(Object.keys(transformers))
}
