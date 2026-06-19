import type { LineRef } from "engine/types";

export class Arrival {
  id: string;
  position: LineRef;
  screenId?: string;

  constructor(id: string, position: LineRef, screenId?: string) {
    this.id = id;
    this.position = position;
    this.screenId = screenId;
  }
}
