import { create } from "zustand"
import { persist } from "zustand/middleware"

type DevStore = { devMode: boolean; toggleDevMode: () => void }

export const useDevStore = create<DevStore>()(
  persist(
    (set) => ({
      devMode: false,
      toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),
    }),
    { name: "tickwire-dev" }
  )
)
