import type { LineRef } from "engine/types";

export class Start {
  id: string;
  position: LineRef;
  delay: number;
  screenId?: string;

  constructor(id: string, position: LineRef, delay: number = 0, screenId?: string) {
    this.id = id;
    this.position = position;
    this.delay = delay;
    this.screenId = screenId;
  }
}
