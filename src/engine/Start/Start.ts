import type { LineRef } from "engine/types";

export class Start {
  id: string;
  position: LineRef;
  delay: number;

  constructor(id: string, position: LineRef, delay: number = 0) {
    this.id = id;
    this.position = position;
    this.delay = delay;
  }
}
