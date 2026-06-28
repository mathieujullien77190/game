import { useLangStore } from "langStore"

export const useLang = () => useLangStore((s) => s.t)
