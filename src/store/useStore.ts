import { create } from "zustand";
import Line from "engine/Line";
import { Start } from "engine/Start";
import { Arrival } from "engine/Arrival";
import { Switch } from "engine/Switch";
import { Ball } from "engine/Ball";
import type { Point, LineRef } from "engine/types";
import {
  setMode,
  setHoveredLineId,
  setHoveredLinkId,
  setHoveredStartId,
  setHoveredArrivalId,
  addSwitch,
  removeSwitch,
  setHoveredSwitchId,
  setSwitchActiveLink,
  setPendingStart,
  setPendingEnd,
  addLine,
  removeLine,
  setLineColor,
  addStart,
  removeStart,
  addArrival,
  removeArrival,
  addBall,
  removeBall,
  setBallColor,
  setBallSpeed,
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
const LS_BALLS = "game-editor-balls";
const LS_NEXT_BALL_ID = "game-editor-next-ball-id";

const loadLines = (): Line[] => {
  try {
    const raw = localStorage.getItem(LS_LINES);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; start: Point; end: Point; control?: Point; color?: string }[];
    return data.map(({ id, start, end, control, color }) => new Line(id, start, end, control, color));
  } catch {
    return [];
  }
};

const loadNextLineId = (): number => {
  try {
    const raw = localStorage.getItem(LS_NEXT_ID);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
};

const loadLinkActive = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(LS_LINK_ACTIVE);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

const loadStarts = (): Start[] => {
  try {
    const raw = localStorage.getItem(LS_STARTS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; position: LineRef; delay?: number }[];
    return data.map(({ id, position, delay }) => new Start(id, position, delay ?? 0));
  } catch {
    return [];
  }
};

const loadNextStartId = (): number => {
  try {
    const raw = localStorage.getItem(LS_NEXT_START_ID);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
};

const loadArrivals = (): Arrival[] => {
  try {
    const raw = localStorage.getItem(LS_ARRIVALS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; position: LineRef }[];
    return data.map(({ id, position }) => new Arrival(id, position));
  } catch {
    return [];
  }
};

const loadNextArrivalId = (): number => {
  try {
    const raw = localStorage.getItem(LS_NEXT_ARRIVAL_ID);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
};

const loadSwitches = (): Switch[] => {
  try {
    const raw = localStorage.getItem(LS_SWITCHES);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; input?: LineRef; position?: LineRef; enter?: LineRef }[];
    return data.map(({ id, input, position, enter }) => new Switch(id, input ?? enter ?? position!));
  } catch {
    return [];
  }
};

const loadNextSwitchId = (): number => {
  try {
    const raw = localStorage.getItem(LS_NEXT_SWITCH_ID);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
};

const loadBalls = (): Ball[] => {
  try {
    const raw = localStorage.getItem(LS_BALLS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; color: string; speed?: number }[];
    return data.map(({ id, color, speed }) => new Ball(id, color, speed ?? 1));
  } catch {
    return [];
  }
};

const loadNextBallId = (): number => {
  try {
    const raw = localStorage.getItem(LS_NEXT_BALL_ID);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
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
  balls: loadBalls(),
  nextBallId: loadNextBallId(),
  mode: "idle",
  pendingStart: null,
  pendingEnd: null,
  showGrid: true,
  hoveredLineId: null,
  hoveredLinkId: null,
  hoveredStartId: null,
  hoveredArrivalId: null,
  hoveredSwitchId: null,
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
  setHoveredSwitchId: setHoveredSwitchId(set),
  setSwitchActiveLink: setSwitchActiveLink(set),
  addBall: addBall(set),
  removeBall: removeBall(set),
  setBallColor: setBallColor(set),
  setBallSpeed: setBallSpeed(set),
  toggleGrid: toggleGrid(set),
  setLinkActives: setLinkActives(set),
  toggleLinkActive: toggleLinkActive(set),
  updateLineAnchor: updateLineAnchor(set),
  updateLineControl: updateLineControl(set),
  clearLines: clearLines(set),
  updateStartDelay: updateStartDelay(set),
}));

useStore.subscribe((state) => {
  localStorage.setItem(
    LS_LINES,
    JSON.stringify(
      state.lines.map((l) => ({ id: l.id, start: l.start, end: l.end, control: l.control, color: l.color }))
    )
  );
  localStorage.setItem(LS_NEXT_ID, String(state.nextLineId));
  localStorage.setItem(LS_LINK_ACTIVE, JSON.stringify(state.linkActive));
  localStorage.setItem(
    LS_STARTS,
    JSON.stringify(state.starts.map((s) => ({ id: s.id, position: s.position, delay: s.delay })))
  );
  localStorage.setItem(LS_NEXT_START_ID, String(state.nextStartId));
  localStorage.setItem(
    LS_ARRIVALS,
    JSON.stringify(state.arrivals.map((a) => ({ id: a.id, position: a.position })))
  );
  localStorage.setItem(LS_NEXT_ARRIVAL_ID, String(state.nextArrivalId));
  localStorage.setItem(
    LS_SWITCHES,
    JSON.stringify(state.switches.map((s) => ({ id: s.id, input: s.input })))
  );
  localStorage.setItem(LS_NEXT_SWITCH_ID, String(state.nextSwitchId));
  localStorage.setItem(
    LS_BALLS,
    JSON.stringify(state.balls.map((b) => ({ id: b.id, color: b.color, speed: b.speed })))
  );
  localStorage.setItem(LS_NEXT_BALL_ID, String(state.nextBallId));
});
