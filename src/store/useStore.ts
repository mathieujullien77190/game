import { create } from "zustand";
import Line from "engine/Line";
import { Start } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { Switch } from "engine/Switch";
import { Painter } from "engine/Painter";
import { Token } from "engine/Token";
import { Screen } from "engine/Screen";
import type { Point, LineRef } from "engine/types";
import {
  setMode,
  setHoveredLineId,
  setHoveredLinkId,
  setHoveredStartId,
  setHoveredArrivalId,
  addSwitch,
  removeSwitch,
  setSwitchInput,
  setHoveredSwitchId,
  setSwitchActiveLink,
  addPainter,
  removePainter,
  setPainterColor,
  setHoveredPainterId,
  setPendingStart,
  setPendingEnd,
  addLine,
  removeLine,
  setLineColor,
  addStart,
  removeStart,
  addArrival,
  removeArrival,
  addToken,
  removeToken,
  setTokenColor,
  setTokenSpeed,
  setTokenShape,
  addScreen,
  removeScreen,
  setActiveScreenId,
  importLevel,
  toggleGrid,
  setLinkActives,
  toggleLinkActive,
  updateLineAnchor,
  updateLineControl,
  clearLines,
  updateStartDelay,
} from "./actions";
import type { Store } from "./types";

const LS_LINES = "game-editor-lines";
const LS_NEXT_ID = "game-editor-next-id";
const LS_LINK_ACTIVE = "game-editor-link-active";
const LS_STARTS = "game-editor-starts";
const LS_NEXT_START_ID = "game-editor-next-start-id";
const LS_ARRIVALS = "game-editor-arrivals";
const LS_NEXT_ARRIVAL_ID = "game-editor-next-arrival-id";
const LS_SWITCHES = "game-editor-switches";
const LS_NEXT_SWITCH_ID = "game-editor-next-switch-id";
const LS_PAINTERS = "game-editor-painters";
const LS_NEXT_PAINTER_ID = "game-editor-next-painter-id";
const LS_TOKENS = "game-editor-tokens";
const LS_NEXT_TOKEN_ID = "game-editor-next-token-id";
const LS_SCREENS = "game-editor-screens";
const LS_NEXT_SCREEN_ID = "game-editor-next-screen-id";

const loadLines = (): Line[] => {
  try {
    const raw = localStorage.getItem(LS_LINES);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; start: Point; end: Point; control?: Point; color?: string; screenId?: string }[];
    return data.map(({ id, start, end, control, color, screenId }) => new Line(id, start, end, control, color, screenId));
  } catch { return []; }
};

const loadNextLineId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadLinkActive = (): Record<string, boolean> => {
  try { const raw = localStorage.getItem(LS_LINK_ACTIVE); return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}; } catch { return {}; }
};

const loadStarts = (): Start[] => {
  try {
    const raw = localStorage.getItem(LS_STARTS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; position: LineRef; delay?: number; screenId?: string }[];
    return data.map(({ id, position, delay, screenId }) => new Start(id, position, delay ?? 0, screenId));
  } catch { return []; }
};

const loadNextStartId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_START_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadArrivals = (): Arrival[] => {
  try {
    const raw = localStorage.getItem(LS_ARRIVALS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; position: LineRef; screenId?: string }[];
    return data.map(({ id, position, screenId }) => new Arrival(id, position, screenId));
  } catch { return []; }
};

const loadNextArrivalId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_ARRIVAL_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadSwitches = (): Switch[] => {
  try {
    const raw = localStorage.getItem(LS_SWITCHES);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; input?: LineRef; position?: LineRef; enter?: LineRef; screenId?: string }[];
    return data.map(({ id, input, position, enter, screenId }) => new Switch(id, input ?? enter ?? position!, 0, screenId));
  } catch { return []; }
};

const loadNextSwitchId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_SWITCH_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadPainters = (): Painter[] => {
  try {
    const raw = localStorage.getItem(LS_PAINTERS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; input: LineRef; color: string; screenId?: string }[];
    return data.map(({ id, input, color, screenId }) => new Painter(id, input, color, screenId));
  } catch { return []; }
};

const loadNextPainterId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_PAINTER_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadTokens = (): Token[] => {
  try {
    const raw = localStorage.getItem(LS_TOKENS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; color: string; speed?: number; shape?: "circle" | "square" }[];
    return data.map(({ id, color, speed, shape }) => new Token(id, color, speed ?? 1, shape ?? "circle"));
  } catch { return []; }
};

const loadNextTokenId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_TOKEN_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

const loadScreens = (): Screen[] => {
  try {
    const raw = localStorage.getItem(LS_SCREENS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string }[];
    return data.map(({ id }) => new Screen(id));
  } catch { return []; }
};

const loadNextScreenId = (): number => {
  try { const raw = localStorage.getItem(LS_NEXT_SCREEN_ID); return raw ? parseInt(raw, 10) : 1; } catch { return 1; }
};

export const useStore = create<Store>((set) => ({
  lines: loadLines(),
  nextLineId: loadNextLineId(),
  starts: loadStarts(),
  nextStartId: loadNextStartId(),
  arrivals: loadArrivals(),
  nextArrivalId: loadNextArrivalId(),
  switches: loadSwitches(),
  nextSwitchId: loadNextSwitchId(),
  painters: loadPainters(),
  nextPainterId: loadNextPainterId(),
  tokens: loadTokens(),
  nextTokenId: loadNextTokenId(),
  screens: loadScreens(),
  nextScreenId: loadNextScreenId(),
  activeScreenId: null,
  mode: "idle",
  pendingStart: null,
  pendingEnd: null,
  showGrid: true,
  hoveredLineId: null,
  hoveredLinkId: null,
  hoveredStartId: null,
  hoveredArrivalId: null,
  hoveredSwitchId: null,
  hoveredPainterId: null,
  linkActive: loadLinkActive(),
  setMode: setMode(set),
  setHoveredLineId: setHoveredLineId(set),
  setHoveredLinkId: setHoveredLinkId(set),
  setHoveredStartId: setHoveredStartId(set),
  setHoveredArrivalId: setHoveredArrivalId(set),
  setPendingStart: setPendingStart(set),
  setPendingEnd: setPendingEnd(set),
  addLine: addLine(set),
  removeLine: removeLine(set),
  setLineColor: setLineColor(set),
  addStart: addStart(set),
  removeStart: removeStart(set),
  addArrival: addArrival(set),
  removeArrival: removeArrival(set),
  addSwitch: addSwitch(set),
  removeSwitch: removeSwitch(set),
  setSwitchInput: setSwitchInput(set),
  setHoveredSwitchId: setHoveredSwitchId(set),
  addPainter: addPainter(set),
  removePainter: removePainter(set),
  setPainterColor: setPainterColor(set),
  setHoveredPainterId: setHoveredPainterId(set),
  setSwitchActiveLink: setSwitchActiveLink(set),
  importLevel: importLevel(set),
  addToken: addToken(set),
  removeToken: removeToken(set),
  setTokenColor: setTokenColor(set),
  setTokenSpeed: setTokenSpeed(set),
  setTokenShape: setTokenShape(set),
  addScreen: addScreen(set),
  removeScreen: removeScreen(set),
  setActiveScreenId: setActiveScreenId(set),
  toggleGrid: toggleGrid(set),
  setLinkActives: setLinkActives(set),
  toggleLinkActive: toggleLinkActive(set),
  updateLineAnchor: updateLineAnchor(set),
  updateLineControl: updateLineControl(set),
  clearLines: clearLines(set),
  updateStartDelay: updateStartDelay(set),
}));

useStore.subscribe((state) => {
  localStorage.setItem(LS_LINES, JSON.stringify(
    state.lines.map((l) => ({ id: l.id, start: l.start, end: l.end, control: l.control, color: l.color, screenId: l.screenId }))
  ));
  localStorage.setItem(LS_NEXT_ID, String(state.nextLineId));
  localStorage.setItem(LS_LINK_ACTIVE, JSON.stringify(state.linkActive));
  localStorage.setItem(LS_STARTS, JSON.stringify(
    state.starts.map((s) => ({ id: s.id, position: s.position, delay: s.delay, screenId: s.screenId }))
  ));
  localStorage.setItem(LS_NEXT_START_ID, String(state.nextStartId));
  localStorage.setItem(LS_ARRIVALS, JSON.stringify(
    state.arrivals.map((a) => ({ id: a.id, position: a.position, screenId: a.screenId }))
  ));
  localStorage.setItem(LS_NEXT_ARRIVAL_ID, String(state.nextArrivalId));
  localStorage.setItem(LS_SWITCHES, JSON.stringify(
    state.switches.map((s) => ({ id: s.id, input: s.input, screenId: s.screenId }))
  ));
  localStorage.setItem(LS_NEXT_SWITCH_ID, String(state.nextSwitchId));
  localStorage.setItem(LS_PAINTERS, JSON.stringify(
    state.painters.map((p) => ({ id: p.id, input: p.input, color: p.color, screenId: p.screenId }))
  ));
  localStorage.setItem(LS_NEXT_PAINTER_ID, String(state.nextPainterId));
  localStorage.setItem(LS_TOKENS, JSON.stringify(
    state.tokens.map((t) => ({ id: t.id, color: t.color, speed: t.speed, shape: t.shape }))
  ));
  localStorage.setItem(LS_NEXT_TOKEN_ID, String(state.nextTokenId));
  localStorage.setItem(LS_SCREENS, JSON.stringify(
    state.screens.map((s) => ({ id: s.id }))
  ));
  localStorage.setItem(LS_NEXT_SCREEN_ID, String(state.nextScreenId));
});
