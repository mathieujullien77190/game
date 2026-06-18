import { DEFAULT_BALL_COLOR } from "engine/colors";

export class Ball {
  id: string;
  color: string;
  speed: number;

  constructor(id: string, color: string = DEFAULT_BALL_COLOR, speed: number = 1) {
    this.id = id;
    this.color = color;
    this.speed = speed;
  }
}
