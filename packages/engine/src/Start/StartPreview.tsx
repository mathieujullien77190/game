import type { JSX } from "react";
import { Start } from "./Start";
import { COLOR_BLACK, COLOR_LIGHT_GRAY } from "../constants";
import type { LinePreview } from "../Line/LinePreview";
import type { TokenPreview } from "../Token/TokenPreview";

export class StartPreview extends Start {
  static readonly RADIUS = 17;
  static readonly STROKE_WIDTH = 4;
  static readonly RING_IDLE_COLOR = "#ccc";
  static readonly RING_ACTIVE_COLOR = COLOR_BLACK;

  render = (
    lines: Record<string, LinePreview>,
    tokens: TokenPreview[],
    elapsed: number,
    sid: string,
  ): JSX.Element | null => {
    const line = lines[this.lineId];
    if (!line || line.screenId !== sid) { this._renderCache = null; return null; }
    const pt =
      this.endpoint === "end"
        ? line.points[line.points.length - 1]
        : line.points[0];
    if (!pt) return null;

    const {
      RADIUS: r,
      STROKE_WIDTH: sw,
      RING_IDLE_COLOR: idleColor,
      RING_ACTIVE_COLOR: activeColor,
    } = StartPreview;
    const nextWaiting = tokens
      .filter((t) => t.startId === this.id && elapsed < t.startAt)
      .sort((a, b) => a.startAt - b.startAt)[0];
    const remaining = nextWaiting ? nextWaiting.startAt - elapsed : 0;
    const tokenColor = nextWaiting ? (nextWaiting.displayColor || nextWaiting.color as string) : activeColor;
    const progress =
      this.delay > 0 && remaining > 0 ? 1 - remaining / this.delay : 0;
    const angle = this.endpoint === "end" ? pt.angle + Math.PI : pt.angle;
    const arcEnd = angle + progress * Math.PI * 2;
    const largeArc = progress > 0.5 ? 1 : 0;

    this._renderCache = { pt, r, sw, idleColor, activeColor, angle, arcEnd, largeArc, progress, remaining, nextWaiting, tokenColor };

    return (
      <g key={this.id}>
        {nextWaiting && nextWaiting.renderShape(pt.x, pt.y, pt.angle)}
      </g>
    );
  };

  private _renderCache: {
    pt: { x: number; y: number };
    r: number; sw: number;
    idleColor: string; activeColor: string;
    angle: number; arcEnd: number; largeArc: number;
    progress: number; remaining: number;
    nextWaiting: TokenPreview | undefined;
    tokenColor: string;
  } | null = null;

  renderAfter = (): JSX.Element | null => {
    const c = this._renderCache;
    if (!c) return null;
    const { pt, r, sw, idleColor, activeColor, angle, arcEnd, largeArc, progress, remaining, nextWaiting, tokenColor } = c;
    return (
      <g key={`sa-${this.id}`}>
        {remaining > 0 && this.delay > 0 ? (
          <>
            <circle cx={pt.x} cy={pt.y} r={r} fill="none" stroke={idleColor} strokeWidth={sw} />
            {progress > 0 && (
              <path
                d={`M${pt.x + r * Math.cos(angle)},${pt.y + r * Math.sin(angle)}A${r},${r},0,${largeArc},1,${pt.x + r * Math.cos(arcEnd)},${pt.y + r * Math.sin(arcEnd)}`}
                fill="none"
                stroke={tokenColor}
                strokeWidth={sw}
                strokeLinecap="round"
              />
            )}
          </>
        ) : (
          <circle cx={pt.x} cy={pt.y} r={r} fill="none" stroke={nextWaiting ? activeColor : idleColor} strokeWidth={sw} />
        )}
      </g>
    );
  };
}
