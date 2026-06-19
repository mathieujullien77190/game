import { DEFAULT_TOKEN_COLOR } from "engine/colors";

export type TokenShape = "circle" | "square" | "triangle";

export class Token {
  id: string;
  color: string;
  speed: number;
  shape: TokenShape;

  constructor(id: string, color: string = DEFAULT_TOKEN_COLOR, speed: number = 1, shape: TokenShape = "circle") {
    this.id = id;
    this.color = color;
    this.speed = speed;
    this.shape = shape;
  }
}
