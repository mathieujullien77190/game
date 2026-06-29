import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type DevStore = { devMode: boolean; toggleDevMode: () => void }

export const useDevStore = create<DevStore>()(
  persist(
    (set) => ({
      devMode: false,
      toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),
    }),
    {
      name: "tickwire-dev",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
