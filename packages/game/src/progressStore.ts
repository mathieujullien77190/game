import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type MapResult = { stars: number; bestTime: number }

export type HistoryEntry = {
  mapId: string
  mapName: string
  time: number
  stars: number
  won: boolean
  date: string
}

export const ACHIEVEMENTS = [
  { id: "premiers-pas", icon: "✦" },
  { id: "speedrun", icon: "◷" },
  { id: "sans-faute", icon: "★" },
  { id: "perfection", icon: "✧" },
  { id: "collection", icon: "▦" },
  { id: "maitrise", icon: "⚡" },
]

type ProgressStore = {
  results: Record<string, MapResult>
  history: HistoryEntry[]
  achievements: Record<string, string>
  lastPlayedMapId: string | null
  recordResult: (params: {
    mapId: string
    mapName: string
    time: number
    stars: number
    noCollision: boolean
    won: boolean
  }) => void
  totalStars: () => number
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      results: {},
      history: [],
      achievements: {},
      lastPlayedMapId: null,

      totalStars: () => Object.values(get().results).reduce((sum, r) => sum + r.stars, 0),

      recordResult: ({ mapId, mapName, time, stars, noCollision, won }) => {
        set((state) => {
          const prev = state.results[mapId]
          const isNewRecord = won && (!prev || time < prev.bestTime)

          const newResults = won
            ? {
                ...state.results,
                [mapId]: {
                  stars: Math.max(prev?.stars ?? 0, stars),
                  bestTime: prev ? Math.min(prev.bestTime, time) : time,
                },
              }
            : state.results

          const entry: HistoryEntry = { mapId, mapName, time, stars, won, date: new Date().toISOString() }

          const now = new Date().toISOString()
          const newAchievements = { ...state.achievements }
          const completedMaps = Object.keys(newResults)
          const threeStarMaps = Object.values(newResults).filter((r) => r.stars === 3).length

          if (won && !newAchievements["premiers-pas"]) newAchievements["premiers-pas"] = now
          if (won && time < 60 && !newAchievements["speedrun"]) newAchievements["speedrun"] = now
          if (won && noCollision && !newAchievements["sans-faute"]) newAchievements["sans-faute"] = now
          if (won && stars === 3 && !newAchievements["perfection"]) newAchievements["perfection"] = now
          if (completedMaps.length >= 3 && !newAchievements["collection"]) newAchievements["collection"] = now
          if (threeStarMaps >= 5 && !newAchievements["maitrise"]) newAchievements["maitrise"] = now

          void isNewRecord
          return {
            results: newResults,
            history: [entry, ...state.history].slice(0, 100),
            achievements: newAchievements,
            lastPlayedMapId: mapId,
          }
        })
      },
    }),
    {
      name: "tickwire-progress",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
