import type { LineRef } from "engine/types";

export class Start {
  id: string;
  position: LineRef;

  constructor(id: string, position: LineRef) {
    this.id = id;
    this.position = position;
  }
}
