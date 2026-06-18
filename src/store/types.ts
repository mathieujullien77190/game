import type Line from "engine/Line";
import type { Start } from "engine/Start";
import type { Arrival } from "engine/Arrival";
import type { Switch } from "engine/Switch";
import type { Painter } from "engine/Painter";
import type { Ball } from "engine/Ball";
import type { Point, LineRef } from "engine/types";

export type EditorMode = "idle" | "addLine" | "addCurve" | "addStart" | "addArrival" | "addSwitch" | "addPainter";

export type StoreState = {
  lines: Line[];
  nextLineId: number;
  starts: Start[];
  nextStartId: number;
  arrivals: Arrival[];
  nextArrivalId: number;
  switches: Switch[];
  nextSwitchId: number;
  painters: Painter[];
  nextPainterId: number;
  balls: Ball[];
  nextBallId: number;
  mode: EditorMode;
  pendingStart: Point | null;
  pendingEnd: Point | null;
  showGrid: boolean;
  hoveredLineId: string | null;
  hoveredLinkId: string | null;
  hoveredStartId: string | null;
  hoveredArrivalId: string | null;
  hoveredSwitchId: string | null;
  hoveredPainterId: string | null;
  linkActive: Record<string, boolean>;
};

export type StoreActions = {
  setMode: (mode: EditorMode) => void;
  setHoveredLineId: (id: string | null) => void;
  setHoveredLinkId: (id: string | null) => void;
  setHoveredStartId: (id: string | null) => void;
  setHoveredArrivalId: (id: string | null) => void;
  setPendingStart: (point: Point | null) => void;
  setPendingEnd: (point: Point | null) => void;
  addLine: (start: Point, end: Point, control?: Point) => void;
  removeLine: (index: number) => void;
  addStart: (position: LineRef) => void;
  removeStart: (index: number) => void;
  updateStartDelay: (index: number, delayMs: number) => void;
  addArrival: (position: LineRef) => void;
  removeArrival: (index: number) => void;
  addSwitch: (position: LineRef) => void;
  removeSwitch: (index: number) => void;
  setHoveredSwitchId: (id: string | null) => void;
  addPainter: (input: LineRef) => void;
  removePainter: (index: number) => void;
  setPainterColor: (index: number, color: string) => void;
  setHoveredPainterId: (id: string | null) => void;
  setSwitchActiveLink: (position: LineRef, activeLinkId: string) => void;
  setLinkActives: (updates: Record<string, boolean>) => void;
  setLineColor: (index: number, color: string) => void;
  addBall: () => void;
  removeBall: (index: number) => void;
  setBallColor: (index: number, color: string) => void;
  setBallSpeed: (index: number, speed: number) => void;
  toggleGrid: () => void;
  toggleLinkActive: (linkId: string) => void;
  updateLineAnchor: (index: number, which: "start" | "end", point: Point) => void;
  updateLineControl: (index: number, point: Point) => void;
  clearLines: () => void;
};

export type Store = StoreState & StoreActions;

export type Set = (fn: (state: Store) => Partial<Store>) => void;
