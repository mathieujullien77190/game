import Line from "engine/Line";
import type { AnchorTarget } from "engine/Manager";
import type { Ball } from "engine/Ball";
import type { Start } from "engine/Start";
import type { Anchor } from "engine/types";
import { FPS, BASE_PX_PER_SEC } from "engine/constants";
import type { BallInstance, PendingLaunch, SimulationState } from "./types";

const PX_PER_TICK = BASE_PX_PER_SEC / FPS;
const DT_MS = 1000 / FPS;

type AdvanceResult = BallInstance | { _arrivalId: string } | null;

const resolveNext = (
  lineId: string,
  anchor: Anchor,
  activePaths: Record<string, AnchorTarget>,
): AnchorTarget | null => {
  return activePaths[`${lineId}::${anchor}`] ?? null;
};

const handleTransition = (
  ball: BallInstance,
  remaining: number,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  depth: number,
): AdvanceResult => {
  const anchor: Anchor = ball.direction === 1 ? "end" : "start";
  const next = resolveNext(ball.lineId, anchor, activePaths);
  if (!next) {
    const arrivalId = arrivalPaths[`${ball.lineId}::${anchor}`];
    return arrivalId ? { _arrivalId: arrivalId } : null;
  }
  const nextLine = lines[next.id];
  if (!nextLine) return null;
  const dir: 1 | -1 = next.anchor === "start" ? 1 : -1;
  const ptIdx = next.anchor === "start" ? 0 : nextLine.points.length - 1;
  return advanceBall(
    { ...ball, lineId: next.id, ptIdx, segOffset: 0, direction: dir },
    remaining,
    lines,
    activePaths,
    arrivalPaths,
    depth + 1,
  );
};

const advanceBall = (
  ball: BallInstance,
  remaining: number,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  depth = 0,
): AdvanceResult => {
  if (depth > 10) return ball;

  const line = lines[ball.lineId];
  if (!line) return null;

  const { ptIdx, segOffset, direction } = ball;
  const segIdx = direction === 1 ? ptIdx : ptIdx - 1;
  const segLen = line.segments[segIdx];

  if (segLen === undefined) {
    return handleTransition(ball, remaining, lines, activePaths, arrivalPaths, depth);
  }

  const spaceLeft = segLen - segOffset;

  if (remaining < spaceLeft) {
    return { ...ball, segOffset: segOffset + remaining };
  }

  const overflow = remaining - spaceLeft;
  const newPtIdx = ptIdx + direction;

  if (direction === 1 && newPtIdx >= line.points.length - 1) {
    return handleTransition(
      { ...ball, ptIdx: newPtIdx, segOffset: 0 },
      overflow,
      lines,
      activePaths,
      arrivalPaths,
      depth,
    );
  }
  if (direction === -1 && newPtIdx <= 0) {
    return handleTransition(
      { ...ball, ptIdx: newPtIdx, segOffset: 0 },
      overflow,
      lines,
      activePaths,
      arrivalPaths,
      depth,
    );
  }

  return advanceBall(
    { ...ball, ptIdx: newPtIdx, segOffset: 0 },
    overflow,
    lines,
    activePaths,
    arrivalPaths,
    depth + 1,
  );
};

export const initSimulation = (
  balls: Ball[],
  starts: Start[],
): SimulationState => {
  const pending: PendingLaunch[] = [];
  for (const start of starts) {
    for (let i = 0; i < balls.length; i++) {
      pending.push({
        instanceId: `${start.id}::${balls[i].id}`,
        ballId: balls[i].id,
        color: balls[i].color,
        speed: balls[i].speed,
        lineRef: start.position,
        launchAt: start.delay * (i + 1),
      });
    }
  }
  return { elapsed: 0, active: [], pending, done: [], arrived: [] };
};

export const tick = (
  state: SimulationState,
  lines: Record<string, Line>,
  activePaths: Record<string, AnchorTarget>,
  arrivalPaths: Record<string, string>,
  allPaths: Record<string, AnchorTarget[]>,
): SimulationState => {
  const newElapsed = state.elapsed + DT_MS;

  const stillPending = state.pending.filter((p) => p.launchAt > newElapsed);
  const launching = state.pending.filter((p) => p.launchAt <= newElapsed);

  const toProcess: BallInstance[] = [...state.active];
  for (const launch of launching) {
    const line = lines[launch.lineRef.id];
    if (!line) continue;
    toProcess.push({
      instanceId: launch.instanceId,
      ballId: launch.ballId,
      color: launch.color,
      speed: launch.speed,
      lineId: launch.lineRef.id,
      ptIdx: launch.lineRef.anchor === "start" ? 0 : line.points.length - 1,
      segOffset: 0,
      direction: launch.lineRef.anchor === "start" ? 1 : -1,
    });
  }

  const newActive: BallInstance[] = [];
  const newDone = [...state.done];
  const newArrived = [...state.arrived];

  for (const ball of toProcess) {
    const result = advanceBall(
      ball,
      ball.speed * PX_PER_TICK,
      lines,
      activePaths,
      arrivalPaths,
    );
    if (result === null) {
      newDone.push(ball.instanceId);
    } else if ("_arrivalId" in result) {
      const alreadyArrived = newArrived.some(
        (a) => a.instanceId === ball.instanceId,
      );
      if (!alreadyArrived) {
        newArrived.push({
          instanceId: ball.instanceId,
          arrivalId: result._arrivalId,
          color: ball.color,
        });
      }
    } else {
      newActive.push(result as BallInstance);
    }
  }

  return {
    elapsed: newElapsed,
    active: newActive,
    pending: stillPending,
    done: newDone,
    arrived: newArrived,
  };
};
