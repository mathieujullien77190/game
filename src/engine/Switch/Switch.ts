import type { LineRef } from "engine/types";

export class Switch {
  id: string;
  position: LineRef;
  activeIndex: number;
  inputLine: LineRef | null;

  constructor(id: string, position: LineRef, activeIndex = 0, inputLine: LineRef | null = null) {
    this.id = id;
    this.position = position;
    this.activeIndex = activeIndex;
    this.inputLine = inputLine;
  }
}
