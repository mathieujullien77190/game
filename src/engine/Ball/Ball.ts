export const BALL_PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#6b7280",
] as const;

export type BallColor = (typeof BALL_PALETTE)[number];

export class Ball {
  id: string;
  color: string;
  speed: number;

  constructor(id: string, color: string = BALL_PALETTE[0], speed: number = 1) {
    this.id = id;
    this.color = color;
    this.speed = speed;
  }
}
