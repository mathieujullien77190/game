export type Difficulty = "Tutorial" | "Beginner" | "Advanced" | "Expert" | "Hidden"

export type MapDef = {
  id: string
  num: number
  file: string
  difficulty: Difficulty
  starThresholds: [number, number, number] // [3★ max secs, 2★ max secs, 1★ max secs]
}

export const MAP_LIST: MapDef[] = [
  {
    id: "carte-01",
    num: 1,
    file: "default.json",
    difficulty: "Tutoriel",
    starThresholds: [60, 120, 180],
  },
  {
    id: "carte-02",
    num: 2,
    file: "default.json",
    difficulty: "Tutoriel",
    starThresholds: [60, 120, 180],
  },
  {
    id: "carte-03",
    num: 3,
    file: "default.json",
    difficulty: "Tutoriel",
    starThresholds: [60, 120, 180],
  },
  { id: "carte-04", num: 4, file: "default.json", difficulty: "Avancé", starThresholds: [45, 90, 150] },
  { id: "carte-05", num: 5, file: "default.json", difficulty: "Avancé", starThresholds: [45, 90, 150] },
  { id: "carte-06", num: 6, file: "default.json", difficulty: "Avancé", starThresholds: [45, 90, 150] },
  { id: "carte-07", num: 7, file: "default.json", difficulty: "Expert", starThresholds: [30, 60, 120] },
  { id: "carte-08", num: 8, file: "default.json", difficulty: "Expert", starThresholds: [30, 60, 120] },
  { id: "carte-09", num: 9, file: "default.json", difficulty: "Expert", starThresholds: [30, 60, 120] },
]

export const getMapById = (id: string): MapDef | undefined => MAP_LIST.find((m) => m.id === id)

export const getNextMap = (id: string): MapDef | undefined => {
  const idx = MAP_LIST.findIndex((m) => m.id === id)
  return idx >= 0 && idx < MAP_LIST.length - 1 ? MAP_LIST[idx + 1] : undefined
}

export const calcStars = (time: number, thresholds: [number, number, number]): 1 | 2 | 3 => {
  if (time <= thresholds[0]) return 3
  if (time <= thresholds[1]) return 2
  return 1
}

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")
  return `${m}:${s}`
}

export const renderStars = (stars: number): string => "★".repeat(stars) + "☆".repeat(3 - stars)
