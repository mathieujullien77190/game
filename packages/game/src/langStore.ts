import { create } from "zustand"
import { persist } from "zustand/middleware"
import { fr, en } from "./translations"
import type { Translation } from "./translations"

export type Lang = "fr" | "en"

type LangStore = {
  lang: Lang
  t: Translation
  setLang: (lang: Lang) => void
}

const TRANSLATIONS: Record<Lang, Translation> = { fr, en }

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: "fr",
      t: fr,
      setLang: (lang) => set({ lang, t: TRANSLATIONS[lang] }),
    }),
    {
      name: "tickwire-lang",
      partialize: (state) => ({ lang: state.lang }),
      onRehydrateStorage: () => (state) => {
        if (state) state.t = TRANSLATIONS[state.lang]
      },
    }
  )
)
