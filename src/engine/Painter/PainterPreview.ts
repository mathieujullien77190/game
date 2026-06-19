import type { Point } from "engine/types";
import { Painter } from "./Painter";

const SPIN_ROTATIONS = 16;
const RAMP = 0.25;
const NORM = 1 - RAMP;

const spinEase = (t: number): number => {
  if (t < RAMP) {
    return (t * t) / (2 * RAMP * NORM);
  } else if (t < 1 - RAMP) {
    return RAMP / (2 * NORM) + (t - RAMP) / NORM;
  } else {
    const s = 1 - t;
    return 1 - (s * s) / (2 * RAMP * NORM);
  }
};

export class PainterPreview extends Painter {
  drawBefore(ctx: CanvasRenderingContext2D, point: Point): void {
    const R = 12;
    ctx.setLineDash([]);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAfter(ctx: CanvasRenderingContext2D, point: Point, animProgress?: number): void {
    const R = 12;
    ctx.setLineDash([]);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.arc(point.x, point.y, R, 0, Math.PI * 2);
    ctx.stroke();

    if (animProgress !== undefined) {
      const angle = spinEase(animProgress) * SPIN_ROTATIONS * Math.PI * 2;
      const FADE = 0.08;
      const alpha =
        animProgress < FADE
          ? animProgress / FADE
          : animProgress > 1 - FADE
            ? (1 - animProgress) / FADE
            : 1;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const a = angle + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, R + 5, a, a + Math.PI / 4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.lineCap = "butt";
    }

  }
}
