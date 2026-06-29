import type { JSX, ReactNode } from "react";
import * as SVG from "../svgElements"
import { Transformer } from "./Transformer";
import { COLOR_WHITE } from "../constants";

const ORBIT_R = 20;
const ORBIT_DOT_R = 3;
const SPIRAL_TURNS = 6;
const SPIRAL_STROKE_WIDTH = 4;
const IDLE_DOT_SPEED = 0.4;
const DOT_INITIAL_ANGLE = Math.PI / 4;
const TRAIL_SPAN = Math.PI * 0.5;
const TRAIL_SEGS = 12;
const CENTER_R = 5;
const CENTER_SQUARE_HALF = 5;
const CENTER_SQUARE_RX = 2;
const CENTER_COLOR_R = 4;

export class TransformerPreview extends Transformer {
  static readonly ROTATE_ARC_R = 10;
  static readonly ROTATE_ARC_SPAN = Math.PI * 0.5;
  static readonly ROTATE_SPEED = Math.PI * 1.4;
  static readonly ROTATE_ARC_COUNT = 3;
  static readonly ROTATE_ARROW_LEN = 4.5;
  static readonly ROTATE_ARROW_SPREAD = 0.5;
  static readonly ROTATE_STROKE_WIDTH = 2.5;

  transformProgress: number = -1;
  currentTokenColor: string = "";

  private dotAngle = (elapsed: number) =>
    this.transformProgress >= 0
      ? DOT_INITIAL_ANGLE + this.transformProgress * Math.PI * 2 * SPIRAL_TURNS
      : DOT_INITIAL_ANGLE + elapsed * IDLE_DOT_SPEED;

  private bgCircle = (pt: { x: number; y: number }) => (
    <SVG.circle
      cx={pt.x} cy={pt.y}
      r={ORBIT_R}
      fill={COLOR_WHITE}
      stroke="#ccc"
      strokeWidth={4}
    />
  );

  private orbitDot = (pt: { x: number; y: number }, angle: number) => (
    <SVG.circle
      cx={pt.x + Math.cos(angle) * ORBIT_R}
      cy={pt.y + Math.sin(angle) * ORBIT_R}
      r={ORBIT_DOT_R}
      fill="#999"
    />
  );

  private trailArcs = (
    pt: { x: number; y: number },
    angle: number,
    stroke: string,
  ): ReactNode[] =>
    this.transformProgress > 0
      ? Array.from({ length: TRAIL_SEGS }, (_, i) => {
          const a0 = angle - TRAIL_SPAN * (1 - i / TRAIL_SEGS);
          const a1 = angle - TRAIL_SPAN * (1 - (i + 1) / TRAIL_SEGS);
          return (
            <SVG.path
              key={i}
              d={`M${pt.x + ORBIT_R * Math.cos(a0)},${pt.y + ORBIT_R * Math.sin(a0)}A${ORBIT_R},${ORBIT_R},0,0,1,${pt.x + ORBIT_R * Math.cos(a1)},${pt.y + ORBIT_R * Math.sin(a1)}`}
              fill="none"
              stroke={stroke}
              strokeWidth={SPIRAL_STROKE_WIDTH}
              strokeLinecap="butt"
              opacity={(i + 1) / TRAIL_SEGS}
            />
          );
        })
      : [];

  renderRotate = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    const {
      ROTATE_ARC_R: r,
      ROTATE_ARC_SPAN,
      ROTATE_SPEED,
      ROTATE_ARC_COUNT,
      ROTATE_ARROW_LEN,
      ROTATE_ARROW_SPREAD,
      ROTATE_STROKE_WIDTH,
    } = TransformerPreview;
    const rot = elapsed * ROTATE_SPEED;
    const arcs: ReactNode[] = [];
    for (let i = 0; i < ROTATE_ARC_COUNT; i++) {
      const start = (i * Math.PI * 2) / ROTATE_ARC_COUNT + rot;
      const end = start + ROTATE_ARC_SPAN;
      const ax = r * Math.cos(end) + pt.x;
      const ay = r * Math.sin(end) + pt.y;
      const backDir = end - Math.PI / 2;
      arcs.push(
        <SVG.g key={i}>
          <SVG.path
            d={`M${pt.x + r * Math.cos(start)},${pt.y + r * Math.sin(start)}A${r},${r},0,0,1,${ax},${ay}`}
            fill="none" stroke="#ccc" strokeWidth={ROTATE_STROKE_WIDTH} strokeLinecap="round"
          />
          <SVG.path
            d={`M${ax + ROTATE_ARROW_LEN * Math.cos(backDir + ROTATE_ARROW_SPREAD)},${ay + ROTATE_ARROW_LEN * Math.sin(backDir + ROTATE_ARROW_SPREAD)}L${ax},${ay}L${ax + ROTATE_ARROW_LEN * Math.cos(backDir - ROTATE_ARROW_SPREAD)},${ay + ROTATE_ARROW_LEN * Math.sin(backDir - ROTATE_ARROW_SPREAD)}`}
            fill="none" stroke="#ccc" strokeWidth={ROTATE_STROKE_WIDTH} strokeLinecap="round"
          />
        </SVG.g>,
      );
    }
    return (
      <SVG.g key={this.id}>
        <SVG.circle cx={pt.x} cy={pt.y} r={r + 6} fill={COLOR_WHITE} />
        {arcs}
      </SVG.g>
    );
  };

  renderFade = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    const angle = this.dotAngle(elapsed);
    return (
      <SVG.g key={this.id}>
        {this.bgCircle(pt)}
        {this.trailArcs(pt, angle, "#999")}
        {this.orbitDot(pt, angle)}
        <SVG.circle cx={pt.x} cy={pt.y} r={CENTER_R} fill="#999" opacity={this.amount} />
      </SVG.g>
    );
  };

  renderColor = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    const { color, currentTokenColor } = this;
    const angle = this.dotAngle(elapsed);
    return (
      <SVG.g key={this.id}>
        {this.bgCircle(pt)}
        {this.trailArcs(pt, angle, currentTokenColor || color)}
        {this.orbitDot(pt, angle)}
        <SVG.circle cx={pt.x} cy={pt.y} r={CENTER_COLOR_R} fill={color} />
      </SVG.g>
    );
  };

  renderShape = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    const angle = this.dotAngle(elapsed);
    return (
      <SVG.g key={this.id}>
        {this.bgCircle(pt)}
        {this.trailArcs(pt, angle, "#999")}
        {this.orbitDot(pt, angle)}
        {this.targetType === "square" ? (
          <SVG.rect
            x={pt.x - CENTER_SQUARE_HALF} y={pt.y - CENTER_SQUARE_HALF}
            width={CENTER_SQUARE_HALF * 2} height={CENTER_SQUARE_HALF * 2}
            rx={CENTER_SQUARE_RX} fill="#999"
          />
        ) : (
          <SVG.circle cx={pt.x} cy={pt.y} r={CENTER_R} fill="#999" />
        )}
      </SVG.g>
    );
  };

  renderAfter = (): JSX.Element | null => null;

  render = (pt: { x: number; y: number }, elapsed: number): JSX.Element => {
    switch (this.type) {
      case "rotate": return this.renderRotate(pt, elapsed);
      case "fade":   return this.renderFade(pt, elapsed);
      case "color":  return this.renderColor(pt, elapsed);
      case "shape":  return this.renderShape(pt, elapsed);
    }
  };
}
