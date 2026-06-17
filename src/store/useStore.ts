import { create } from "zustand";
import Line from "engine/Line";
import { Start } from "engine/Start";
import { Ball } from "engine/Ball";
import type { Point, LineRef } from "engine/types";
import {
  setMode,
  setHoveredLineId,
  setHoveredStartId,
  setPendingStart,
  setPendingEnd,
  addLine,
  removeLine,
  addStart,
  removeStart,
  addBall,
  removeBall,
  setBallColor,
  toggleGrid,
  toggleLinkActive,
  updateLineAnchor,
  updateLineControl,
  clearLines,
} from "./actions";
import type { Store } from "./types";

const LS_LINES = "game-editor-lines";
const LS_NEXT_ID = "game-editor-next-id";
const LS_LINK_ACTIVE = "game-editor-link-active";
const LS_STARTS = "game-editor-starts";
const LS_NEXT_START_ID = "game-editor-next-start-id";
const LS_BALLS = "game-editor-balls";
const LS_NEXT_BALL_ID = "game-editor-next-ball-id";

const loadLines = (): Line[] => {
  try {
    const raw = localStorage.getItem(LS_LINES);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; start: Point; end: Point; control?: Point }[];
    return data.map(({ id, start, end, control }) => new Line(id, start, end, control));
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
    const data = JSON.parse(raw) as { id: string; position: LineRef }[];
    return data.map(({ id, position }) => new Start(id, position));
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

const loadBalls = (): Ball[] => {
  try {
    const raw = localStorage.getItem(LS_BALLS);
    if (!raw) return [];
    const data = JSON.parse(raw) as { id: string; color: string }[];
    return data.map(({ id, color }) => new Ball(id, color));
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
  balls: loadBalls(),
  nextBallId: loadNextBallId(),
  mode: "idle",
  pendingStart: null,
  pendingEnd: null,
  showGrid: true,
  hoveredLineId: null,
  hoveredStartId: null,
  linkActive: loadLinkActive(),
  setMode: setMode(set),
  setHoveredLineId: setHoveredLineId(set),
  setHoveredStartId: setHoveredStartId(set),
  setPendingStart: setPendingStart(set),
  setPendingEnd: setPendingEnd(set),
  addLine: addLine(set),
  removeLine: removeLine(set),
  addStart: addStart(set),
  removeStart: removeStart(set),
  addBall: addBall(set),
  removeBall: removeBall(set),
  setBallColor: setBallColor(set),
  toggleGrid: toggleGrid(set),
  toggleLinkActive: toggleLinkActive(set),
  updateLineAnchor: updateLineAnchor(set),
  updateLineControl: updateLineControl(set),
  clearLines: clearLines(set),
}));

useStore.subscribe((state) => {
  localStorage.setItem(
    LS_LINES,
    JSON.stringify(
      state.lines.map((l) => ({ id: l.id, start: l.start, end: l.end, control: l.control }))
    )
  );
  localStorage.setItem(LS_NEXT_ID, String(state.nextLineId));
  localStorage.setItem(LS_LINK_ACTIVE, JSON.stringify(state.linkActive));
  localStorage.setItem(
    LS_STARTS,
    JSON.stringify(state.starts.map((s) => ({ id: s.id, position: s.position })))
  );
  localStorage.setItem(LS_NEXT_START_ID, String(state.nextStartId));
  localStorage.setItem(
    LS_BALLS,
    JSON.stringify(state.balls.map((b) => ({ id: b.id, color: b.color })))
  );
  localStorage.setItem(LS_NEXT_BALL_ID, String(state.nextBallId));
});
