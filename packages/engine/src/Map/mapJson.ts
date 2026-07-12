import { LineEditor } from "../entities/Line/LineEditor"
import { syncLineCounter, type LineType } from "../entities/Line/Line"
import { syncTokenCounter } from "../entities/Token/Token"
import { StartEditor } from "../entities/Start/StartEditor"
import { syncStartCounter } from "../entities/Start/Start"
import { SwitchEditor } from "../entities/Switch/SwitchEditor"
import { syncSwitchCounter } from "../entities/Switch/Switch"
import { ClonerEditor } from "../entities/Cloner/ClonerEditor"
import { syncClonerCounter } from "../entities/Cloner/Cloner"
import { Transformer, syncTransformerCounter, type TransformerType } from "../entities/Transformer/Transformer"
import { Inverter, syncInverterCounter } from "../entities/Inverter/Inverter"
import { ScreenGate, syncScreenGateCounter } from "../entities/ScreenGate/ScreenGate"
import { ArrivalEditor } from "../entities/Arrival/ArrivalEditor"
import { syncArrivalCounter } from "../entities/Arrival/Arrival"
import type { EditorManager } from "../Manager/EditorManager"
import type { Point } from "../types"
import type { StartEditor as StartEditorType } from "../entities/Start/StartEditor"
import type { SwitchEditor as SwitchEditorType } from "../entities/Switch/SwitchEditor"
import type { ClonerEditor as ClonerEditorType } from "../entities/Cloner/ClonerEditor"

type MapToken = { id: string; color: string; type: string; speed: number; angled?: boolean }
type MapStart = { id: string; lineId: string; endpoint: "start" | "end"; delay: number; firstDelay?: number; screenId?: string; tokens?: MapToken[]; fadeLineAfter?: number }

export type MapJson = {
  screens?: string[]
  lines: { id: string; start: Point; end: Point; type: LineType; cp1?: Point; cp2?: Point; boost?: number; flip?: boolean; tunnel?: boolean; showSpeed?: boolean; limitation?: number; frequency?: number; amplitude?: number; turns?: number; screenId?: string; color?: string }[]
  links: { id: string; line1: { lineId: string; endpoint: "start" | "end" }; line2: { lineId: string; endpoint: "start" | "end" }; activated: boolean }[]
  tokens?: MapToken[]
  starts: MapStart[]
  switches: Record<string, { linkIds: string[]; activeLinkId: string | null; linkedSwitchIds: string[]; screenId?: string; color?: string; mode?: "manual" | "auto" }>
  cloners?: Record<string, { linkIds: string[]; screenId?: string }>
  transformers?: { id: string; linkId: string; type: TransformerType; amount: number; color: string; targetType: string; screenId?: string }[]
  inverters?: { id: string; linkId: string; screenId?: string; effect?: "invert" | "grayscale" | "dark" }[]
  arrivals?: { id: string; lineId: string; endpoint: "start" | "end"; demands?: { id: string; color: string; type: string; angled: boolean }[]; screenId?: string; queueSide?: "top" | "bottom" | "left" | "right" | "hidden" }[]
  // legacy: ancien format à arrivée unique
  arrival?: { id: string; lineId: string; endpoint: "start" | "end"; demands?: { id: string; color: string; type: string; angled: boolean }[]; screenId?: string; queueSide?: "top" | "bottom" | "left" | "right" | "hidden" } | null
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
  starts: Record<string, StartEditorType>,
  switches: Record<string, SwitchEditorType>,
  switchLinks: Record<string, string[]>,
  transformers: Record<string, Transformer> = {},
  arrivals: Record<string, ArrivalEditor> = {},
  inverters: Record<string, Inverter> = {},
  screens: string[] = ["main"],
  screenGates: Record<string, ScreenGate> = {},
  screenTimeMultipliers: Record<string, number> = {},
  cloners: Record<string, ClonerEditorType> = {},
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
    ...(l.flip ? { flip: true } : {}),
    ...(l.tunnel ? { tunnel: true } : {}),
    ...(l.showSpeed ? { showSpeed: true } : {}),
    ...(l.limitation !== 0 ? { limitation: l.limitation } : {}),
    ...(l.type === "sine" ? { frequency: l.frequency, amplitude: l.amplitude } : {}),
    ...(l.type === "spiral" ? { turns: l.turns } : {}),
    ...(l.screenId !== "main" ? { screenId: l.screenId } : {}),
    ...(l.color ? { color: l.color } : {}),
  })),
  links: Object.values(editorManager.data.links).map((lk) => ({
    id: lk.id,
    line1: lk.line1,
    line2: lk.line2,
    activated: lk.activated,
  })),
  starts: Object.values(starts).map((s) => ({
    id: s.id,
    lineId: s.lineId,
    endpoint: s.endpoint,
    delay: s.delay,
    tokens: s.tokens,
    ...(s.firstDelay !== 2 ? { firstDelay: s.firstDelay } : {}),
    ...(s.screenId !== "main" ? { screenId: s.screenId } : {}),
    ...(s.fadeLineAfter > 0 ? { fadeLineAfter: s.fadeLineAfter } : {}),
  })),
  switches: Object.fromEntries(
    Object.values(switches).map((sw) => [
      sw.id,
      {
        linkIds: sw.linkIds,
        activeLinkId: sw.activeLinkId,
        linkedSwitchIds: switchLinks[sw.id] ?? [],
        ...(sw.screenId !== "main" ? { screenId: sw.screenId } : {}),
        ...(sw.color !== "#ccc" ? { color: sw.color } : {}),
        ...(sw.mode !== "manual" ? { mode: sw.mode } : {}),
      },
    ])
  ),
  cloners: Object.fromEntries(
    Object.values(cloners).map((cl) => [
      cl.id,
      {
        linkIds: cl.linkIds,
        ...(cl.screenId !== "main" ? { screenId: cl.screenId } : {}),
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
  arrivals: Object.values(arrivals).map((a) => ({
    id: a.id,
    lineId: a.lineId,
    endpoint: a.endpoint,
    demands: a.demands,
    ...(a.screenId !== "main" ? { screenId: a.screenId } : {}),
    ...(a.queueSide !== "right" ? { queueSide: a.queueSide } : {}),
  })),
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

  json.lines?.forEach(({ id, start, end, type, cp1, cp2, boost, flip, tunnel, showSpeed, limitation, frequency, amplitude, turns, screenId, color }) => {
    const line = new LineEditor(start, end, type ?? "straight", id, cp1, cp2, screenId)
    if (boost) line.boost = boost
    if (flip) { line.flip = true; line.computePoints() }
    if (tunnel) line.tunnel = true
    if (showSpeed) line.showSpeed = true
    if (limitation) line.limitation = limitation
    if (color) line.color = color
    if (type === "sine") {
      if (frequency !== undefined) line.frequency = frequency
      if (amplitude !== undefined) line.amplitude = amplitude
      line.computePoints()
    }
    if (type === "spiral") {
      if (turns !== undefined) line.turns = turns
      line.computePoints()
    }
    editorManager.addLine(line)
  })
  syncLineCounter(json.lines?.map((l) => l.id) ?? [])

  json.links?.forEach(({ id, activated }) => {
    const link = editorManager.data.links[id]
    if (link) link.activated = activated
  })

  const starts: Record<string, StartEditorType> = {}
  json.starts?.forEach(({ id, lineId, endpoint, delay, firstDelay, screenId, tokens, fadeLineAfter }) => {
    const s = new StartEditor(lineId, endpoint, delay, id, screenId, firstDelay, tokens ?? [], fadeLineAfter ?? 0)
    starts[s.id] = s
  })

  // Backward compat: map.json files with top-level tokens → assign to first start
  if (json.tokens?.length && Object.keys(starts).length > 0) {
    const first = Object.values(starts)[0]
    if (first.tokens.length === 0) {
      first.tokens = json.tokens.map((t) => ({ id: t.id, color: t.color, type: t.type, speed: t.speed, angled: t.angled }))
    }
  }

  syncStartCounter(Object.keys(starts))
  syncTokenCounter(Object.values(starts).flatMap((s) => s.tokens.map((t) => t.id)))

  const switches: Record<string, SwitchEditorType> = {}
  const switchLinks: Record<string, string[]> = {}
  Object.entries(json.switches ?? {}).forEach(([id, { linkIds, activeLinkId, linkedSwitchIds, screenId, color, mode }]) => {
    const sw = new SwitchEditor(id, linkIds ?? [], activeLinkId ?? null, screenId, color, mode)
    switches[sw.id] = sw
    switchLinks[id] = linkedSwitchIds ?? []
  })
  syncSwitchCounter(Object.keys(switches))

  const cloners: Record<string, ClonerEditor> = {}
  Object.entries(json.cloners ?? {}).forEach(([id, { linkIds, screenId }]) => {
    cloners[id] = new ClonerEditor(id, linkIds ?? [], screenId)
  })
  syncClonerCounter(Object.keys(cloners))

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

  const arrivals: Record<string, ArrivalEditor> = {}
  json.arrivals?.forEach(({ id, lineId, endpoint, demands, screenId, queueSide }) => {
    arrivals[id] = new ArrivalEditor(lineId, endpoint, id, (demands ?? []) as any, screenId, queueSide)
  })
  // Backward compat : map.json avec une arrivée unique (ancien format) → migrée dans arrivals
  if (json.arrival && Object.keys(arrivals).length === 0) {
    const a = json.arrival
    arrivals[a.id] = new ArrivalEditor(a.lineId, a.endpoint, a.id, (a.demands ?? []) as any, a.screenId, a.queueSide)
  }
  syncArrivalCounter(Object.keys(arrivals))

  const screens = json.screens ?? ["main"]

  const screenGates: Record<string, ScreenGate> = {}
  json.screenGates?.forEach(({ id, linkId, screenId, targetScreenId, entryKey, exitKey }) => {
    screenGates[id] = new ScreenGate(linkId, id, screenId, targetScreenId, entryKey, exitKey)
  })
  syncScreenGateCounter(Object.keys(screenGates))

  const screenTimeMultipliers: Record<string, number> = json.screenTimeMultipliers ?? {}

  return { starts, switches, switchLinks, cloners, transformers, inverters, arrivals, screens, screenGates, screenTimeMultipliers }
}
