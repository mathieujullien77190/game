import { LineEditor } from "engine/Line/LineEditor"
import { syncLineCounter, type LineType } from "engine/Line/Line"
import { Token, syncTokenCounter, type TokenColor, type TokenType } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { syncStartCounter } from "engine/Start/Start"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { syncSwitchCounter } from "engine/Switch/Switch"
import type { EditorManager } from "engine/Manager/EditorManager"
import type { Point } from "engine/types"
import type { StartEditor as StartEditorType } from "engine/Start/StartEditor"
import type { SwitchEditor as SwitchEditorType } from "engine/Switch/SwitchEditor"

export type MapJson = {
  lines: { id: string; start: Point; end: Point; type: LineType; cp1?: Point; cp2?: Point }[]
  links: { id: string; line1: { lineId: string; endpoint: "start" | "end" }; line2: { lineId: string; endpoint: "start" | "end" }; activated: boolean }[]
  tokens: { id: string; color: TokenColor; type: TokenType; speed: number }[]
  starts: { id: string; lineId: string; endpoint: "start" | "end"; delay: number }[]
  switches: Record<string, { linkIds: string[]; activeLinkId: string | null; linkedSwitchIds: string[] }>
}

export const serializeMap = (
  editorManager: EditorManager,
  tokens: Record<string, Token>,
  starts: Record<string, StartEditorType>,
  switches: Record<string, SwitchEditorType>,
  switchLinks: Record<string, string[]>
): MapJson => ({
  lines: Object.values(editorManager.data.lines).map((l) => ({
    id: l.id,
    start: l.start,
    end: l.end,
    type: l.type,
    ...(l.cp1 ? { cp1: l.cp1 } : {}),
    ...(l.cp2 ? { cp2: l.cp2 } : {}),
  })),
  links: Object.values(editorManager.data.links).map((lk) => ({
    id: lk.id,
    line1: lk.line1,
    line2: lk.line2,
    activated: lk.activated,
  })),
  tokens: Object.values(tokens).map((t) => ({
    id: t.id,
    color: t.color,
    type: t.type as TokenType,
    speed: t.speed,
  })),
  starts: Object.values(starts).map((s) => ({
    id: s.id,
    lineId: s.lineId,
    endpoint: s.endpoint,
    delay: s.delay,
  })),
  switches: Object.fromEntries(
    Object.values(switches).map((sw) => [
      sw.id,
      { linkIds: sw.linkIds, activeLinkId: sw.activeLinkId, linkedSwitchIds: switchLinks[sw.id] ?? [] },
    ])
  ),
})

export const deserializeMap = (json: MapJson, editorManager: EditorManager) => {
  editorManager.data.lines = {}
  editorManager.data.links = {}

  json.lines?.forEach(({ id, start, end, type, cp1, cp2 }) => {
    editorManager.addLine(new LineEditor(start, end, type ?? "straight", id, cp1, cp2))
  })
  syncLineCounter(json.lines?.map((l) => l.id) ?? [])

  json.links?.forEach(({ id, activated }) => {
    const link = editorManager.data.links[id]
    if (link) link.activated = activated
  })

  const tokens: Record<string, Token> = {}
  json.tokens?.forEach(({ id, color, type, speed }) => {
    const t = new Token(color, speed, id, type ?? "round")
    tokens[t.id] = t
  })
  syncTokenCounter(Object.keys(tokens))

  const starts: Record<string, StartEditorType> = {}
  json.starts?.forEach(({ id, lineId, endpoint, delay }) => {
    const s = new StartEditor(lineId, endpoint, delay, id)
    starts[s.id] = s
  })
  syncStartCounter(Object.keys(starts))

  const switches: Record<string, SwitchEditorType> = {}
  const switchLinks: Record<string, string[]> = {}
  Object.entries(json.switches ?? {}).forEach(([id, { linkIds, activeLinkId, linkedSwitchIds }]) => {
    const sw = new SwitchEditor(id, linkIds ?? [], activeLinkId ?? null)
    switches[sw.id] = sw
    switchLinks[id] = linkedSwitchIds ?? []
  })
  syncSwitchCounter(Object.keys(switches))

  return { tokens, starts, switches, switchLinks }
}
