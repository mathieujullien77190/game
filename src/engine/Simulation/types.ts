export type TokenInstance = {
  instanceId: string;
  tokenId: string;
  color: string;
  speed: number;
  shape: "circle" | "square";
  launchAt: number;
  lineId: string;
  ptIdx: number;
  segOffset: number;
  direction: 1 | -1;
  pauseUntil?: number;
  fromColor?: string;
};

export type ArrivedToken = {
  instanceId: string;
  arrivalId: string;
  color: string;
};

export type SimulationState = {
  elapsed: number;
  active: TokenInstance[];
  pending: TokenInstance[];
  done: string[];
  arrived: ArrivedToken[];
};
