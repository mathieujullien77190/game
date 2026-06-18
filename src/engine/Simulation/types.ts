import type { Anchor, LineRef } from "engine/types";

export type BallInstance = {
  instanceId: string;
  ballId: string;
  color: string;
  speed: number;
  launchAt: number;
  lineId: string;
  ptIdx: number;
  segOffset: number;
  direction: 1 | -1;
};

export type PendingLaunch = {
  instanceId: string;
  ballId: string;
  color: string;
  speed: number;
  lineRef: LineRef;
  launchAt: number;
};

export type ArrivedBall = {
  instanceId: string;
  arrivalId: string;
  color: string;
};

export type HeldBall = {
  ball: BallInstance;
  anchor: Anchor;
  releaseAt: number;
  fromColor: string;
  startAt: number;
};

export type SimulationState = {
  elapsed: number;
  active: BallInstance[];
  pending: PendingLaunch[];
  done: string[];
  arrived: ArrivedBall[];
  held: HeldBall[];
};
