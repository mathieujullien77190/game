import type { LineRef } from "engine/types";

export class Painter {
  id: string;
  input: LineRef;
  color: string;

  constructor(id: string, input: LineRef, color: string) {
    this.id = id;
    this.input = input;
    this.color = color;
  }
}
