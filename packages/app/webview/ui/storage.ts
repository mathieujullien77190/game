// Options + progression du joueur, persistées en localStorage (WebView : domStorageEnabled).
// Tout accès est protégé : si le stockage est indisponible, le jeu tourne avec les valeurs par défaut.

export type Options = {
  grid: boolean
  animations: boolean
  fps: boolean
  vibrate: boolean
}

export type LevelProgress = { done: boolean; best?: number }

const OPTIONS_KEY = "ttt.options"
const PROGRESS_KEY = "ttt.progress"

const DEFAULT_OPTIONS: Options = { grid: true, animations: true, fps: false, vibrate: true }

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // stockage plein ou bloqué : on garde l'état en mémoire
  }
}

export const options: Options = read(OPTIONS_KEY, DEFAULT_OPTIONS)
export const saveOptions = () => write(OPTIONS_KEY, options)

const progress: Record<string, LevelProgress> = read(PROGRESS_KEY, {})

export const getProgress = (levelId: string): LevelProgress => progress[levelId] ?? { done: false }

// Enregistre une victoire ; renvoie true si c'est un nouveau meilleur temps.
export const recordWin = (levelId: string, time: number): boolean => {
  const prev = progress[levelId]
  const isBest = prev?.best === undefined || time < prev.best
  progress[levelId] = { done: true, best: isBest ? time : prev?.best }
  write(PROGRESS_KEY, progress)
  return isBest
}

export const resetProgress = () => {
  for (const k of Object.keys(progress)) delete progress[k]
  write(PROGRESS_KEY, progress)
}

// Vibration courte (si activée et supportée par la WebView).
export const vibrate = (pattern: number | number[]) => {
  if (options.vibrate) navigator.vibrate?.(pattern)
}
