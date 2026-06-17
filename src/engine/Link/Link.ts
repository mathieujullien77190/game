import type { Anchor, LineRef } from "engine/types";

export type { Anchor, LineRef };

export class Link {
  id: string;
  line1: LineRef;
  line2: LineRef;
  active: boolean;

  constructor(id: string, line1: LineRef, line2: LineRef, active = true) {
    this.id = id;
    this.line1 = line1;
    this.line2 = line2;
    this.active = active;
  }
}
