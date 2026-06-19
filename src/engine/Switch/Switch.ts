import type { LineRef } from "engine/types";

export type SwitchAnim = { fromAngle: number; diff: number; t: number; duration: number };

export class Switch {
  id: string;
  input: LineRef;
  activeIndex: number;
  screenId?: string;

  static readonly ANIM_DURATION_MS = 300;

  constructor(id: string, input: LineRef, activeIndex = 0, screenId?: string) {
    this.id = id;
    this.input = input;
    this.activeIndex = activeIndex;
    this.screenId = screenId;
  }
}
