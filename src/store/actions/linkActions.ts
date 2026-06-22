import type { Set } from "store/types"

export const createLinkActions = (set: Set) => ({
  toggleLinkActivated: (linkId: string) =>
    set((state) => {
      const link = state.editorManager.data.links[linkId]
      if (!link) return {}
      link.activated = !link.activated
      return { revision: state.revision + 1 }
    }),
})
