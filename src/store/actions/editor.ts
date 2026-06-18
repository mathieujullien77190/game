import Line from "engine/Line";
import { Start } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { Switch } from "engine/Switch";
import { Ball } from "engine/Ball";
import { DEFAULT_BALL_COLOR } from "engine/colors";
import { computeLinks } from "engine/Link";
import type { Point, LineRef } from "engine/types";
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
    lines: [...state.lines, new Line(`line${state.nextLineId}`, start, end, control)],
    nextLineId: state.nextLineId + 1,
  }));

export const removeLine = (set: Set) => (index: number) =>
  set((state) => ({ lines: state.lines.filter((_, i) => i !== index) }));

export const addStart = (set: Set) => (position: LineRef) =>
  set((state) => ({
    starts: [...state.starts, new Start(`start${state.nextStartId}`, position)],
    nextStartId: state.nextStartId + 1,
  }));

export const removeStart = (set: Set) => (index: number) =>
  set((state) => ({ starts: state.starts.filter((_, i) => i !== index) }));

export const updateStartDelay = (set: Set) => (index: number, delayMs: number) =>
  set((state) => ({
    starts: state.starts.map((s, i) =>
      i !== index ? s : new Start(s.id, s.position, delayMs)
    ),
  }));

export const addArrival = (set: Set) => (position: LineRef) =>
  set((state) => ({
    arrivals: [...state.arrivals, new Arrival(`arrival${state.nextArrivalId}`, position)],
    nextArrivalId: state.nextArrivalId + 1,
  }));

export const removeArrival = (set: Set) => (index: number) =>
  set((state) => ({ arrivals: state.arrivals.filter((_, i) => i !== index) }));

export const addSwitch = (set: Set) => (input: LineRef) =>
  set((state) => ({
    switches: [...state.switches, new Switch(`switch${state.nextSwitchId}`, input)],
    nextSwitchId: state.nextSwitchId + 1,
  }));

export const removeSwitch = (set: Set) => (index: number) =>
  set((state) => ({ switches: state.switches.filter((_, i) => i !== index) }));

export const setHoveredSwitchId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredSwitchId: id }));

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
      i !== index ? l : new Line(l.id, l.start, l.end, l.control, color)
    ),
  }));

export const addBall = (set: Set) => () =>
  set((state) => ({
    balls: [...state.balls, new Ball(`ball${state.nextBallId}`, DEFAULT_BALL_COLOR)],
    nextBallId: state.nextBallId + 1,
  }));

export const removeBall = (set: Set) => (index: number) =>
  set((state) => ({ balls: state.balls.filter((_, i) => i !== index) }));

export const setBallColor = (set: Set) => (index: number, color: string) =>
  set((state) => ({
    balls: state.balls.map((b, i) => (i !== index ? b : new Ball(b.id, color, b.speed))),
  }));

export const setBallSpeed = (set: Set) => (index: number, speed: number) =>
  set((state) => ({
    balls: state.balls.map((b, i) => (i !== index ? b : new Ball(b.id, b.color, speed))),
  }));

export const toggleGrid = (set: Set) => () =>
  set((state) => ({ showGrid: !state.showGrid }));

export const clearLines = (set: Set) => () =>
  set(() => ({ lines: [], nextLineId: 1, linkActive: {}, starts: [], nextStartId: 1, arrivals: [], nextArrivalId: 1, switches: [], nextSwitchId: 1 }));

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
        return new Line(l.id, start, end, l.control);
      }),
    }));

export const updateLineControl =
  (set: Set) =>
  (index: number, point: Point) =>
    set((state) => ({
      lines: state.lines.map((l, i) =>
        i !== index ? l : new Line(l.id, l.start, l.end, point)
      ),
    }));
