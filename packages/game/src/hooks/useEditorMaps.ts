import { MAP_LIST } from "maps"
import type { MapDef } from "maps"

// In the native app, maps are statically bundled — no fetch needed
export const useEditorMaps = (): MapDef[] => MAP_LIST
