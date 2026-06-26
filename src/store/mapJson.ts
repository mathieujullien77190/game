import { LineEditor } from "engine/Line/LineEditor"
import { syncLineCounter, type LineType } from "engine/Line/Line"
import { Token, syncTokenCounter, type TokenColor, type TokenType } from "engine/Token/Token"
import { StartEditor } from "engine/Start/StartEditor"
import { syncStartCounter } from "engine/Start/Start"
import { SwitchEditor } from "engine/Switch/SwitchEditor"
import { syncSwitchCounter } from "engine/Switch/Switch"
import { Transformer, syncTransformerCounter, type TransformerType } from "engine/Transformer/Transformer"
import { Inverter, syncInverterCounter } from "engine/Inverter/Inverter"
import { ScreenGate, syncScreenGateCounter } from "engine/ScreenGate/ScreenGate"
import { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import { syncArrivalCounter } from "engine/Arrival/Arrival"
import type { EditorManager } from "engine/Manager/EditorManager"
import type { Point } from "engine/types"
import type { StartEditor as StartEditorType } from "engine/Start/StartEditor"
import type { SwitchEditor as SwitchEditorType } from "engine/Switch/SwitchEditor"

export type MapJson = {
  screens?: string[]
  lines: { id: string; start: Point; end: Point; type: LineType; cp1?: Point; cp2?: Point; boost?: number; tunnel?: boolean; showSpeed?: boolean; limitation?: number; frequency?: number; amplitude?: number; screenId?: string }[]
  links: { id: string; line1: { lineId: string; endpoint: "start" | "end" }; line2: { lineId: string; endpoint: "start" | "end" }; activated: boolean }[]
  tokens: { id: string; color: TokenColor; type: TokenType; speed: number }[]
  starts: { id: string; lineId: string; endpoint: "start" | "end"; delay: number; screenId?: string }[]
  switches: Record<string, { linkIds: string[]; activeLinkId: string | null; linkedSwitchIds: string[]; screenId?: string }>
  transformers?: { id: string; linkId: string; type: TransformerType; amount: number; color: string; targetType: string; screenId?: string }[]
  inverters?: { id: string; linkId: string; screenId?: string; effect?: "invert" | "grayscale" | "dark" }[]
  arrival?: { id: string; lineId: string; endpoint: "start" | "end"; demands?: { id: string; color: string; type: string; angled: boolean }[]; screenId?: string } | null
  screenGates?: { id: string; linkId: string; screenId?: string; targetScreenId: string; entryKey: string; exitKey: string }[]
  screenTimeMultipliers?: Record<string, number>
  // legacy fields for backward compat
  tokenEffects?: { id: string; linkId: string; type: "fade" | "rotate"; amount: number }[]
  rotators?: { id: string; linkId: string }[]
  faders?: { id: string; linkId: string; amount: number }[]
  painters?: { id: string; linkId: string; color: string }[]
}

export const serializeMap = (
  editorManager: EditorManager,
  tokens: Record<string, Token>,
  starts: Record<string, StartEditorType>,
  switches: Record<string, SwitchEditorType>,
  switchLinks: Record<string, string[]>,
  transformers: Record<string, Transformer> = {},
  arrival: ArrivalEditor | null = null,
  inverters: Record<string, Inverter> = {},
  screens: string[] = ["main"],
  screenGates: Record<string, ScreenGate> = {},
  screenTimeMultipliers: Record<string, number> = {},
): MapJson => ({
  screens,
  lines: Object.values(editorManager.data.lines).map((l) => ({
    id: l.id,
    start: l.start,
    end: l.end,
    type: l.type,
    ...(l.cp1 ? { cp1: l.cp1 } : {}),
    ...(l.cp2 ? { cp2: l.cp2 } : {}),
    ...(l.boost !== 0 ? { boost: l.boost } : {}),
    ...(l.tunnel ? { tunnel: true } : {}),
    ...(l.showSpeed ? { showSpeed: true } : {}),
    ...(l.limitation !== 0 ? { limitation: l.limitation } : {}),
    ...(l.type === "sine" ? { frequency: l.frequency, amplitude: l.amplitude } : {}),
    ...(l.screenId !== "main" ? { screenId: l.screenId } : {}),
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
    ...(s.screenId !== "main" ? { screenId: s.screenId } : {}),
  })),
  switches: Object.fromEntries(
    Object.values(switches).map((sw) => [
      sw.id,
      {
        linkIds: sw.linkIds,
        activeLinkId: sw.activeLinkId,
        linkedSwitchIds: switchLinks[sw.id] ?? [],
        ...(sw.screenId !== "main" ? { screenId: sw.screenId } : {}),
      },
    ])
  ),
  transformers: Object.values(transformers).map((tr) => ({
    id: tr.id,
    linkId: tr.linkId,
    type: tr.type,
    amount: tr.amount,
    color: tr.color,
    targetType: tr.targetType,
    ...(tr.screenId !== "main" ? { screenId: tr.screenId } : {}),
  })),
  inverters: Object.values(inverters).map((inv) => ({
    id: inv.id,
    linkId: inv.linkId,
    ...(inv.screenId !== "main" ? { screenId: inv.screenId } : {}),
    ...(inv.effect !== "invert" ? { effect: inv.effect } : {}),
  })),
  arrival: arrival
    ? {
        id: arrival.id,
        lineId: arrival.lineId,
        endpoint: arrival.endpoint,
        demands: arrival.demands,
        ...(arrival.screenId !== "main" ? { screenId: arrival.screenId } : {}),
      }
    : null,
  screenGates: Object.values(screenGates).map((sg) => ({
    id: sg.id,
    linkId: sg.linkId,
    targetScreenId: sg.targetScreenId,
    entryKey: sg.entryKey,
    exitKey: sg.exitKey,
    ...(sg.screenId !== "main" ? { screenId: sg.screenId } : {}),
  })),
  ...(Object.keys(screenTimeMultipliers).length > 0 ? { screenTimeMultipliers } : {}),
})

export const deserializeMap = (json: MapJson, editorManager: EditorManager) => {
  editorManager.data.lines = {}
  editorManager.data.links = {}

  json.lines?.forEach(({ id, start, end, type, cp1, cp2, boost, tunnel, showSpeed, limitation, frequency, amplitude, screenId }) => {
    const line = new LineEditor(start, end, type ?? "straight", id, cp1, cp2, screenId)
    if (boost) line.boost = boost
    if (tunnel) line.tunnel = true
    if (showSpeed) line.showSpeed = true
    if (limitation) line.limitation = limitation
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
  json.starts?.forEach(({ id, lineId, endpoint, delay, screenId }) => {
    const s = new StartEditor(lineId, endpoint, delay, id, screenId)
    starts[s.id] = s
  })
  syncStartCounter(Object.keys(starts))

  const switches: Record<string, SwitchEditorType> = {}
  const switchLinks: Record<string, string[]> = {}
  Object.entries(json.switches ?? {}).forEach(([id, { linkIds, activeLinkId, linkedSwitchIds, screenId }]) => {
    const sw = new SwitchEditor(id, linkIds ?? [], activeLinkId ?? null, screenId)
    switches[sw.id] = sw
    switchLinks[id] = linkedSwitchIds ?? []
  })
  syncSwitchCounter(Object.keys(switches))

  const transformers: Record<string, Transformer> = {}
  json.transformers?.forEach(({ id, linkId, type, amount, color, targetType, screenId }) => {
    transformers[id] = new Transformer(linkId, type, id, amount ?? 0.5, color ?? "#e53935", targetType ?? "square", screenId)
  })
  json.tokenEffects?.forEach(({ id, linkId, type, amount }) => {
    const migId = `transform_te_${id}`
    transformers[migId] = new Transformer(linkId, type, migId, amount ?? 0.5)
  })
  json.rotators?.forEach(({ id, linkId }) => {
    const migId = `transform_rot_${id}`
    transformers[migId] = new Transformer(linkId, "rotate", migId)
  })
  json.faders?.forEach(({ id, linkId, amount }) => {
    const migId = `transform_fad_${id}`
    transformers[migId] = new Transformer(linkId, "fade", migId, amount ?? 0.5)
  })
  json.painters?.forEach(({ id, linkId, color }) => {
    const migId = `transform_pt_${id}`
    transformers[migId] = new Transformer(linkId, "color", migId, 0.5, color)
  })
  syncTransformerCounter(Object.keys(transformers))

  const inverters: Record<string, Inverter> = {}
  json.inverters?.forEach(({ id, linkId, screenId, effect }) => {
    const inv = new Inverter(linkId, id, screenId)
    if (effect) inv.effect = effect
    inverters[id] = inv
  })
  syncInverterCounter(Object.keys(inverters))

  let arrival: ArrivalEditor | null = null
  if (json.arrival) {
    arrival = new ArrivalEditor(json.arrival.lineId, json.arrival.endpoint, json.arrival.id, (json.arrival.demands ?? []) as any, json.arrival.screenId)
    syncArrivalCounter([json.arrival.id])
  }

  const screens = json.screens ?? ["main"]

  const screenGates: Record<string, ScreenGate> = {}
  json.screenGates?.forEach(({ id, linkId, screenId, targetScreenId, entryKey, exitKey }) => {
    screenGates[id] = new ScreenGate(linkId, id, screenId, targetScreenId, entryKey, exitKey)
  })
  syncScreenGateCounter(Object.keys(screenGates))

  const screenTimeMultipliers: Record<string, number> = json.screenTimeMultipliers ?? {}

  return { tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers }
}
