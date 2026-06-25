import { LineEditor } from "engine/Line/LineEditor"
import { syncLineCounter, type LineType } from "engine/Line/Line"
import { Token, syncTokenCounter, type TokenColor, type TokenType } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { syncStartCounter } from "engine/Start/Start"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { syncSwitchCounter } from "engine/Switch/Switch"
import { Rotator, syncRotatorCounter } from "engine/Rotator/Rotator"
import { Fader, syncFaderCounter } from "engine/Fader/Fader"
import { Inverter, syncInverterCounter } from "engine/Inverter/Inverter"
import { Transformer, syncTransformerCounter, type TransformerMode } from "engine/Transformer/Transformer"
import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { syncArrivalCounter } from "engine/Arrival/Arrival"
import type { EditorManager } from "engine/Manager/EditorManager"
import type { Point } from "engine/types"
import type { StartEditor as StartEditorType } from "engine/Start/StartEditor"
import type { SwitchEditor as SwitchEditorType } from "engine/Switch/SwitchEditor"

export type MapJson = {
  lines: { id: string; start: Point; end: Point; type: LineType; cp1?: Point; cp2?: Point; boost?: number; frequency?: number; amplitude?: number }[]
  links: { id: string; line1: { lineId: string; endpoint: "start" | "end" }; line2: { lineId: string; endpoint: "start" | "end" }; activated: boolean }[]
  tokens: { id: string; color: TokenColor; type: TokenType; speed: number }[]
  starts: { id: string; lineId: string; endpoint: "start" | "end"; delay: number }[]
  switches: Record<string, { linkIds: string[]; activeLinkId: string | null; linkedSwitchIds: string[] }>
  rotators?: { id: string; linkId: string }[]
  painters?: { id: string; linkId: string; color: string }[]
  faders?: { id: string; linkId: string; amount: number }[]
  inverters?: { id: string; linkId: string }[]
  transformers?: { id: string; linkId: string; targetType: string; mode?: TransformerMode; color?: string }[]
  arrival?: { id: string; lineId: string; endpoint: "start" | "end"; demands?: { id: string; color: string; type: string; angled: boolean }[] } | null
}

export const serializeMap = (
  editorManager: EditorManager,
  tokens: Record<string, Token>,
  starts: Record<string, StartEditorType>,
  switches: Record<string, SwitchEditorType>,
  switchLinks: Record<string, string[]>,
  rotators: Record<string, Rotator> = {},
  arrival: ArrivalEditor | null = null,
  faders: Record<string, Fader> = {},
  inverters: Record<string, Inverter> = {},
  transformers: Record<string, Transformer> = {},
): MapJson => ({
  lines: Object.values(editorManager.data.lines).map((l) => ({
    id: l.id,
    start: l.start,
    end: l.end,
    type: l.type,
    ...(l.cp1 ? { cp1: l.cp1 } : {}),
    ...(l.cp2 ? { cp2: l.cp2 } : {}),
    ...(l.boost !== 0 ? { boost: l.boost } : {}),
    ...(l.type === "sine" ? { frequency: l.frequency, amplitude: l.amplitude } : {}),
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
  rotators: Object.values(rotators).map((r) => ({ id: r.id, linkId: r.linkId })),
  faders: Object.values(faders).map((f) => ({ id: f.id, linkId: f.linkId, amount: f.amount })),
  inverters: Object.values(inverters).map((inv) => ({ id: inv.id, linkId: inv.linkId })),
  transformers: Object.values(transformers).map((tr) => ({
    id: tr.id,
    linkId: tr.linkId,
    targetType: tr.targetType,
    mode: tr.mode,
    color: tr.color,
  })),
  arrival: arrival ? { id: arrival.id, lineId: arrival.lineId, endpoint: arrival.endpoint, demands: arrival.demands } : null,
})

export const deserializeMap = (json: MapJson, editorManager: EditorManager) => {
  editorManager.data.lines = {}
  editorManager.data.links = {}

  json.lines?.forEach(({ id, start, end, type, cp1, cp2, boost, frequency, amplitude }) => {
    const line = new LineEditor(start, end, type ?? "straight", id, cp1, cp2)
    if (boost) line.boost = boost
    if (type === "sine") {
      if (frequency !== undefined) line.frequency = frequency
      if (amplitude !== undefined) line.amplitude = amplitude
      line.computePoints()
    }
    editorManager.addLine(line)
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

  const rotators: Record<string, Rotator> = {}
  json.rotators?.forEach(({ id, linkId }) => {
    rotators[id] = new Rotator(linkId, id)
  })
  syncRotatorCounter(Object.keys(rotators))

  const faders: Record<string, Fader> = {}
  json.faders?.forEach(({ id, linkId, amount }) => {
    faders[id] = new Fader(linkId, id, amount ?? 0.5)
  })
  syncFaderCounter(Object.keys(faders))

  const inverters: Record<string, Inverter> = {}
  json.inverters?.forEach(({ id, linkId }) => {
    inverters[id] = new Inverter(linkId, id)
  })
  syncInverterCounter(Object.keys(inverters))

  const transformers: Record<string, Transformer> = {}
  json.transformers?.forEach(({ id, linkId, targetType, mode, color }) => {
    transformers[id] = new Transformer(linkId, mode ?? "shape", color ?? "#e53935", targetType ?? "square", id)
  })
  // Migration: old painters → transformers with mode "color"
  json.painters?.forEach(({ id, linkId, color }) => {
    const migId = `migrated_${id}`
    transformers[migId] = new Transformer(linkId, "color", color, "square", migId)
  })
  syncTransformerCounter(Object.keys(transformers))

  let arrival: ArrivalEditor | null = null
  if (json.arrival) {
    arrival = new ArrivalEditor(json.arrival.lineId, json.arrival.endpoint, json.arrival.id, (json.arrival.demands ?? []) as any)
    syncArrivalCounter([json.arrival.id])
  }

  return { tokens, starts, switches, switchLinks, rotators, faders, inverters, transformers, arrival }
}
