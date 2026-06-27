import { SwitchEditor } from "engine/Switch/SwitchEditor"
import type { Set } from "store/types"

export const createSwitchActions = (set: Set) => ({
  addSwitch: (sw: SwitchEditor) =>
    set((state) => ({
      switches: { ...state.switches, [sw.id]: sw },
      revision: state.revision + 1,
    })),

  removeSwitch: (id: string) =>
    set((state) => {
      const switches = { ...state.switches }
      delete switches[id]
      const switchLinks = { ...state.switchLinks }
      delete switchLinks[id]
      for (const [swId, linked] of Object.entries(switchLinks)) {
        if (linked.includes(id)) switchLinks[swId] = linked.filter((lId) => lId !== id)
      }
      return { switches, switchLinks, revision: state.revision + 1 }
    }),

  updateSwitchActiveLink: (id: string, activeLinkId: string) =>
    set((state) => {
      const sw = state.switches[id]
      if (!sw) return {}
      return {
        switches: { ...state.switches, [id]: new SwitchEditor(sw.id, sw.linkIds, activeLinkId) },
        revision: state.revision + 1,
      }
    }),

  updateSwitchLinks: (id: string, linkIds: string[], activeLinkId: string | null) =>
    set((state) => {
      const sw = state.switches[id]
      if (!sw) return {}
      return {
        switches: { ...state.switches, [id]: new SwitchEditor(sw.id, linkIds, activeLinkId) },
        revision: state.revision + 1,
      }
    }),

  toggleSwitchLink: (id1: string, id2: string) =>
    set((state) => {
      const switchLinks = { ...state.switchLinks }
      const l1 = switchLinks[id1] ?? []
      const l2 = switchLinks[id2] ?? []
      if (l1.includes(id2)) {
        switchLinks[id1] = l1.filter((id) => id !== id2)
        switchLinks[id2] = l2.filter((id) => id !== id1)
      } else {
        switchLinks[id1] = [...l1, id2]
        switchLinks[id2] = [...l2, id1]
      }
      return { switchLinks }
    }),

  setHoveredSwitchId: (id: string | null) => set(() => ({ hoveredSwitchId: id })),
})
