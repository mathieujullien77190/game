import Line from "engine/Line";
import { Start } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { Switch } from "engine/Switch";
import { Painter } from "engine/Painter";
import { Token } from "engine/Token";
import { Screen } from "engine/Screen";
import { DEFAULT_TOKEN_COLOR, DEFAULT_TOKEN_COLOR as DEFAULT_PAINTER_COLOR } from "engine/colors";
import { computeLinks } from "engine/Link";
import type { Point, LineRef } from "engine/types";
import type { LevelJSON } from "engine/Manager";
import type { Set, Store } from "store/types";

export const setMode = (set: Set) => (mode: Store["mode"]) =>
  set(() => ({ mode }));

export const setHoveredLineId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredLineId: id }));

export const setHoveredLinkId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredLinkId: id }));

export const setHoveredStartId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredStartId: id }));

export const setHoveredArrivalId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredArrivalId: id }));

export const setPendingStart = (set: Set) => (point: Point | null) =>
  set(() => ({ pendingStart: point }));

export const setPendingEnd = (set: Set) => (point: Point | null) =>
  set(() => ({ pendingEnd: point }));

export const addLine = (set: Set) => (start: Point, end: Point, control?: Point) =>
  set((state) => ({
    lines: [...state.lines, new Line(`line${state.nextLineId}`, start, end, control, undefined, state.activeScreenId ?? undefined)],
    nextLineId: state.nextLineId + 1,
  }));

export const removeLine = (set: Set) => (index: number) =>
  set((state) => ({ lines: state.lines.filter((_, i) => i !== index) }));

export const addStart = (set: Set) => (position: LineRef) =>
  set((state) => ({
    starts: [...state.starts, new Start(`start${state.nextStartId}`, position, 0, state.activeScreenId ?? undefined)],
    nextStartId: state.nextStartId + 1,
  }));

export const removeStart = (set: Set) => (index: number) =>
  set((state) => ({ starts: state.starts.filter((_, i) => i !== index) }));

export const updateStartDelay = (set: Set) => (index: number, delayMs: number) =>
  set((state) => ({
    starts: state.starts.map((s, i) =>
      i !== index ? s : new Start(s.id, s.position, delayMs, s.screenId)
    ),
  }));

export const addArrival = (set: Set) => (position: LineRef) =>
  set((state) => ({
    arrivals: [...state.arrivals, new Arrival(`arrival${state.nextArrivalId}`, position, state.activeScreenId ?? undefined)],
    nextArrivalId: state.nextArrivalId + 1,
  }));

export const removeArrival = (set: Set) => (index: number) =>
  set((state) => ({ arrivals: state.arrivals.filter((_, i) => i !== index) }));

export const addSwitch = (set: Set) => (input: LineRef) =>
  set((state) => ({
    switches: [...state.switches, new Switch(`switch${state.nextSwitchId}`, input, 0, state.activeScreenId ?? undefined)],
    nextSwitchId: state.nextSwitchId + 1,
  }));

export const removeSwitch = (set: Set) => (index: number) =>
  set((state) => ({ switches: state.switches.filter((_, i) => i !== index) }));

export const setSwitchInput = (set: Set) => (index: number, input: LineRef) =>
  set((state) => ({
    switches: state.switches.map((sw, i) =>
      i !== index ? sw : new Switch(sw.id, input, sw.activeIndex, sw.screenId)
    ),
  }));

export const setHoveredSwitchId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredSwitchId: id }));

export const addPainter = (set: Set) => (input: LineRef) =>
  set((state) => ({
    painters: [...state.painters, new Painter(`painter${state.nextPainterId}`, input, DEFAULT_PAINTER_COLOR, state.activeScreenId ?? undefined)],
    nextPainterId: state.nextPainterId + 1,
  }));

export const removePainter = (set: Set) => (index: number) =>
  set((state) => ({ painters: state.painters.filter((_, i) => i !== index) }));

export const setPainterColor = (set: Set) => (index: number, color: string) =>
  set((state) => ({
    painters: state.painters.map((p, i) =>
      i !== index ? p : new Painter(p.id, p.input, color, p.screenId)
    ),
  }));

export const setHoveredPainterId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredPainterId: id }));

export const setSwitchActiveLink = (set: Set) => (position: LineRef, activeLinkId: string) =>
  set((state) => {
    const links = computeLinks(state.lines, state.linkActive);
    const atAnchor = links.filter(
      (lk) =>
        (lk.line1.id === position.id && lk.line1.anchor === position.anchor) ||
        (lk.line2.id === position.id && lk.line2.anchor === position.anchor),
    );
    const newLinkActive = { ...state.linkActive };
    for (const lk of atAnchor) newLinkActive[lk.id] = false;
    newLinkActive[activeLinkId] = true;
    return { linkActive: newLinkActive };
  });

export const setLineColor = (set: Set) => (index: number, color: string) =>
  set((state) => ({
    lines: state.lines.map((l, i) =>
      i !== index ? l : new Line(l.id, l.start, l.end, l.control, color, l.screenId)
    ),
  }));

export const addToken = (set: Set) => () =>
  set((state) => ({
    tokens: [...state.tokens, new Token(`token${state.nextTokenId}`, DEFAULT_TOKEN_COLOR)],
    nextTokenId: state.nextTokenId + 1,
  }));

export const removeToken = (set: Set) => (index: number) =>
  set((state) => ({ tokens: state.tokens.filter((_, i) => i !== index) }));

export const setTokenColor = (set: Set) => (index: number, color: string) =>
  set((state) => ({
    tokens: state.tokens.map((t, i) => (i !== index ? t : new Token(t.id, color, t.speed, t.shape))),
  }));

export const setTokenSpeed = (set: Set) => (index: number, speed: number) =>
  set((state) => ({
    tokens: state.tokens.map((t, i) => (i !== index ? t : new Token(t.id, t.color, speed, t.shape))),
  }));

export const setTokenShape = (set: Set) => (index: number, shape: "circle" | "square" | "triangle") =>
  set((state) => ({
    tokens: state.tokens.map((t, i) => (i !== index ? t : new Token(t.id, t.color, t.speed, shape))),
  }));

export const addScreen = (set: Set) => () =>
  set((state) => ({
    screens: [...state.screens, new Screen(`screen${state.nextScreenId}`)],
    nextScreenId: state.nextScreenId + 1,
  }));

export const removeScreen = (set: Set) => (index: number) =>
  set((state) => ({
    screens: state.screens.filter((_, i) => i !== index),
    activeScreenId: state.activeScreenId === state.screens[index]?.id ? null : state.activeScreenId,
  }));

export const setActiveScreenId = (set: Set) => (id: string | null) =>
  set(() => ({ activeScreenId: id }));

export const importLevel = (set: Set) => (json: LevelJSON) =>
  set(() => {
    const lines = json.lines.map((d) => new Line(d.id, d.start, d.end, d.control, d.color));
    const starts = (json.starts ?? []).map((d) => new Start(d.id, d.position, d.delay ?? 0));
    const arrivals = (json.arrivals ?? []).map((d) => new Arrival(d.id, d.position));
    const switches = (json.switches ?? []).map((d) => new Switch(d.id, d.input));
    const painters = (json.painters ?? []).map((d) => new Painter(d.id, d.input, d.color));
    const tokens = (json.tokens ?? []).map((d) => new Token(d.id, d.color, d.speed ?? 1, d.shape ?? "circle"));
    const linkActive = json.links.reduce<Record<string, boolean>>((acc, lk) => ({ ...acc, [lk.id]: lk.active }), {});
    return {
      lines, starts, arrivals, switches, painters, tokens, linkActive,
      nextLineId: lines.length + 1,
      nextStartId: starts.length + 1,
      nextArrivalId: arrivals.length + 1,
      nextSwitchId: switches.length + 1,
      nextPainterId: painters.length + 1,
      nextTokenId: tokens.length + 1,
    };
  });

export const toggleGrid = (set: Set) => () =>
  set((state) => ({ showGrid: !state.showGrid }));

export const clearLines = (set: Set) => () =>
  set(() => ({
    lines: [], nextLineId: 1, linkActive: {},
    starts: [], nextStartId: 1,
    arrivals: [], nextArrivalId: 1,
    switches: [], nextSwitchId: 1,
    painters: [], nextPainterId: 1,
    screens: [], nextScreenId: 1, activeScreenId: null,
  }));

export const setLinkActives = (set: Set) => (updates: Record<string, boolean>) =>
  set((state) => ({ linkActive: { ...state.linkActive, ...updates } }));

export const toggleLinkActive = (set: Set) => (linkId: string) =>
  set((state) => ({
    linkActive: {
      ...state.linkActive,
      [linkId]: !(state.linkActive[linkId] ?? true),
    },
  }));

export const updateLineAnchor =
  (set: Set) =>
  (index: number, which: "start" | "end", point: Point) =>
    set((state) => ({
      lines: state.lines.map((l, i) => {
        if (i !== index) return l;
        const start = which === "start" ? point : l.start;
        const end = which === "end" ? point : l.end;
        return new Line(l.id, start, end, l.control, l.color, l.screenId);
      }),
    }));

export const updateLineControl =
  (set: Set) =>
  (index: number, point: Point) =>
    set((state) => ({
      lines: state.lines.map((l, i) =>
        i !== index ? l : new Line(l.id, l.start, l.end, point, l.color, l.screenId)
      ),
    }));
