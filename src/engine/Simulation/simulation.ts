import Line from "engine/Line";
import type { AnchorTarget } from "engine/Manager";
import type { Token } from "engine/Token";
import type { Start } from "engine/Start";
import type { Anchor } from "engine/types";
import { FPS, BASE_PX_PER_SEC, PAINTER_HOLD_MS, TOKEN_ACCEL_MS } from "engine/constants";
import type { TokenInstance, SimulationState } from "./types";

const PX_PER_TICK = BASE_PX_PER_SEC / FPS;
const DT_MS = 1000 / FPS;
const TOKEN_CLEARANCE_PX = 15;

const accelDist = (token: { speed: number; launchAt: number }, elapsed: number): number => {
  const t = Math.min(1, (elapsed - token.launchAt) / TOKEN_ACCEL_MS);
  return t * t * token.speed * PX_PER_TICK;
};

type AdvanceResult = TokenInstance | { _arrivalId: string } | null;

const resolveNext = (
  lineId: string,
  anchor: Anchor,
  activePaths: Record<string, AnchorTarget>,
): AnchorTarget | null => activePaths[`${lineId}::${anchor}`] ?? null;

const handleTransition = (
  token: TokenInstance,
  remaining: number,
  elapsed: number,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  painterMap: Record<string, string>,
  depth: number,
): AdvanceResult => {
  const anchor: Anchor = token.direction === 1 ? "end" : "start";
  const key = `${token.lineId}::${anchor}`;

  const painterColor = painterMap[key];
  if (painterColor !== undefined) {
    return { ...token, color: painterColor, fromColor: token.color, pauseUntil: elapsed + PAINTER_HOLD_MS };
  }

  const next = resolveNext(token.lineId, anchor, activePaths);
  if (!next) {
    const arrivalId = arrivalPaths[key];
    return arrivalId ? { _arrivalId: arrivalId } : null;
  }
  const nextLine = lines[next.id];
  if (!nextLine) return null;
  const dir: 1 | -1 = next.anchor === "start" ? 1 : -1;
  const ptIdx = next.anchor === "start" ? 0 : nextLine.points.length - 1;
  return advanceToken(
    { ...token, lineId: next.id, ptIdx, segOffset: 0, direction: dir },
    remaining, elapsed, lines, activePaths, arrivalPaths, painterMap, depth + 1,
  );
};

const advanceToken = (
  token: TokenInstance,
  remaining: number,
  elapsed: number,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  painterMap: Record<string, string>,
  depth = 0,
): AdvanceResult => {
  if (depth > 10) return token;

  const line = lines[token.lineId];
  if (!line) return null;

  const { ptIdx, segOffset, direction } = token;
  const segIdx = direction === 1 ? ptIdx : ptIdx - 1;
  const segLen = line.segments[segIdx];

  if (segLen === undefined) {
    return handleTransition(token, remaining, elapsed, lines, activePaths, arrivalPaths, painterMap, depth);
  }

  const spaceLeft = segLen - segOffset;
  if (remaining < spaceLeft) return { ...token, segOffset: segOffset + remaining };

  const overflow = remaining - spaceLeft;
  const newPtIdx = ptIdx + direction;

  if ((direction === 1 && newPtIdx >= line.points.length - 1) || (direction === -1 && newPtIdx <= 0)) {
    return handleTransition(
      { ...token, ptIdx: newPtIdx, segOffset: 0 },
      overflow, elapsed, lines, activePaths, arrivalPaths, painterMap, depth,
    );
  }

  return advanceToken(
    { ...token, ptIdx: newPtIdx, segOffset: 0 },
    overflow, elapsed, lines, activePaths, arrivalPaths, painterMap, depth + 1,
  );
};

const processResult = (
  result: AdvanceResult,
  token: TokenInstance,
  newActive: TokenInstance[],
  newDone: string[],
  newArrived: { instanceId: string; arrivalId: string; color: string }[],
): void => {
  if (result === null) {
    newDone.push(token.instanceId);
  } else if ("_arrivalId" in result) {
    if (!newArrived.some((a) => a.instanceId === token.instanceId)) {
      newArrived.push({ instanceId: token.instanceId, arrivalId: result._arrivalId, color: token.color });
    }
  } else {
    newActive.push(result as TokenInstance);
  }
};

export const initSimulation = (
  tokens: Token[],
  starts: Start[],
  lines: Record<string, Line>,
): SimulationState => {
  const active: TokenInstance[] = [];
  const pending: TokenInstance[] = [];

  for (const start of starts) {
    const line = lines[start.position.id];
    if (!line) continue;
    const startPtIdx = start.position.anchor === "start" ? 0 : line.points.length - 1;
    const direction: 1 | -1 = start.position.anchor === "start" ? 1 : -1;

    for (let i = 0; i < tokens.length; i++) {
      const instance: TokenInstance = {
        instanceId: `${start.id}::${tokens[i].id}`,
        tokenId: tokens[i].id,
        color: tokens[i].color,
        speed: tokens[i].speed,
        shape: tokens[i].shape,
        launchAt: start.delay,
        lineId: start.position.id,
        ptIdx: startPtIdx,
        segOffset: 0,
        direction,
      };
      if (i === 0) {
        active.push(instance);
      } else {
        pending.push(instance);
      }
    }
  }

  return { elapsed: 0, active, pending, done: [], arrived: [] };
};

export const tick = (
  state: SimulationState,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  painterMap: Record<string, string>,
): SimulationState => {
  const newElapsed = state.elapsed + DT_MS;
  const newActive: TokenInstance[] = [];
  const newDone = [...state.done];
  const newArrived = [...state.arrived];

  for (const token of state.active) {
    if (newElapsed < token.launchAt) {
      newActive.push(token);
      continue;
    }

    if (token.pauseUntil !== undefined) {
      if (newElapsed < token.pauseUntil) {
        newActive.push(token);
        continue;
      }
      const anchor: Anchor = token.direction === 1 ? "end" : "start";
      const next = resolveNext(token.lineId, anchor, activePaths);
      if (!next) {
        const arrivalId = arrivalPaths[`${token.lineId}::${anchor}`];
        if (arrivalId && !newArrived.some((a) => a.instanceId === token.instanceId)) {
          newArrived.push({ instanceId: token.instanceId, arrivalId, color: token.color });
        } else {
          newDone.push(token.instanceId);
        }
        continue;
      }
      const nextLine = lines[next.id];
      if (!nextLine) { newDone.push(token.instanceId); continue; }
      const dir: 1 | -1 = next.anchor === "start" ? 1 : -1;
      const ptIdx = next.anchor === "start" ? 0 : nextLine.points.length - 1;
      const releasedToken: TokenInstance = {
        ...token, lineId: next.id, ptIdx, segOffset: 0, direction: dir,
        launchAt: newElapsed, pauseUntil: undefined, fromColor: undefined,
      };
      const result = advanceToken(releasedToken, accelDist(releasedToken, newElapsed), newElapsed, lines, activePaths, arrivalPaths, painterMap);
      processResult(result, token, newActive, newDone, newArrived);
      continue;
    }

    const result = advanceToken(token, accelDist(token, newElapsed), newElapsed, lines, activePaths, arrivalPaths, painterMap);
    processResult(result, token, newActive, newDone, newArrived);
  }

  // Launch pending tokens once their predecessor has cleared the start position
  const newPending = [...state.pending];
  const handledStarts = new Set<string>();

  for (let i = 0; i < newPending.length; i++) {
    const p = newPending[i];
    const startId = p.instanceId.split("::")[0];
    if (handledStarts.has(startId)) continue;
    handledStarts.add(startId);

    const blocked = newActive.some(
      (t) =>
        t.instanceId.startsWith(`${startId}::`) &&
        t.ptIdx === p.ptIdx &&
        t.segOffset < TOKEN_CLEARANCE_PX,
    );

    if (!blocked) {
      newActive.push({ ...p, launchAt: newElapsed + p.launchAt });
      newPending.splice(i, 1);
      i--;
    }
  }

  return { elapsed: newElapsed, active: newActive, pending: newPending, done: newDone, arrived: newArrived };
};
