import type { LineRef } from "engine/types";

export type BallInstance = {
  instanceId: string;
  ballId: string;
  color: string;
  speed: number;
  lineId: string;
  ptIdx: number;    // integer index into line.points
  segOffset: number; // px traveled from points[ptIdx] toward next point (dir=+1) or prev (dir=-1)
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

export type SimulationState = {
  elapsed: number;
  active: BallInstance[];
  pending: PendingLaunch[];
  done: string[];
  arrived: ArrivedBall[];
};
