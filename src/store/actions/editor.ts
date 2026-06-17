import Line from "engine/Line";
import { Start } from "engine/Start";
import { Ball, BALL_PALETTE } from "engine/Ball";
import type { Point, LineRef } from "engine/types";
import type { Set, Store } from "store/types";

export const setMode = (set: Set) => (mode: Store["mode"]) =>
  set(() => ({ mode }));

export const setHoveredLineId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredLineId: id }));

export const setHoveredStartId = (set: Set) => (id: string | null) =>
  set(() => ({ hoveredStartId: id }));

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

export const addBall = (set: Set) => () =>
  set((state) => ({
    balls: [...state.balls, new Ball(`ball${state.nextBallId}`, BALL_PALETTE[0])],
    nextBallId: state.nextBallId + 1,
  }));

export const removeBall = (set: Set) => (index: number) =>
  set((state) => ({ balls: state.balls.filter((_, i) => i !== index) }));

export const setBallColor = (set: Set) => (index: number, color: string) =>
  set((state) => ({
    balls: state.balls.map((b, i) => (i !== index ? b : new Ball(b.id, color))),
  }));

export const toggleGrid = (set: Set) => () =>
  set((state) => ({ showGrid: !state.showGrid }));

export const clearLines = (set: Set) => () =>
  set(() => ({ lines: [], nextLineId: 1, linkActive: {}, starts: [], nextStartId: 1 }));

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
