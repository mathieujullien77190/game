import { Transformer, syncTransformerCounter, type TransformerMode } from "engine/Transformer/Transformer"
import type { Set } from "store/types"

export const createTransformerActions = (set: Set) => ({
  addTransformer: (linkId: string) =>
    set((state) => {
      const tr = new Transformer(linkId)
      return { transformers: { ...state.transformers, [tr.id]: tr }, revision: state.revision + 1 }
    }),

  removeTransformer: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.transformers
      return { transformers: rest, revision: state.revision + 1 }
    }),

  setHoveredTransformerId: (id: string | null) => set(() => ({ hoveredTransformerId: id })),

  updateTransformerTargetType: (id: string, targetType: string) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], targetType } },
      revision: state.revision + 1,
    })),

  updateTransformerColor: (id: string, color: string) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], color } },
      revision: state.revision + 1,
    })),

  updateTransformerMode: (id: string, mode: TransformerMode) =>
    set((state) => ({
      transformers: { ...state.transformers, [id]: { ...state.transformers[id], mode } },
      revision: state.revision + 1,
    })),
})

export const syncTransformers = (transformers: Record<string, Transformer>) => {
  syncTransformerCounter(Object.keys(transformers))
}
