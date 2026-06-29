import type { JSX } from "react";
import * as SVG from "../svgElements"
import type { Link, LinkEndpoint } from "../Link/Link";
import type { LinePoint } from "../types";
import { Switch } from "./Switch";
import { getSwitchEnterPoint, curveIntersectAngle } from "./switchUtils";
import { COLOR_WHITE } from "../constants";
import { svgDot } from "../svgDot";

const animateAngle = (
  current: number,
  target: number,
  speed: number,
  dt: number,
): number => {
  let delta = target - current;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  if (Math.abs(delta) < SwitchPreview.ANGLE_SNAP_THRESHOLD) return target;
  return current + delta * speed * dt;
};

type LinesRef = Record<string, { points: LinePoint[] }>;
type LinksRef = Record<string, Link>;
type LinkMapRef = Record<string, LinkEndpoint>;

export class SwitchPreview extends Switch {
  static readonly RADIUS = 24;
  static readonly HIT_RADIUS = 36;
  static readonly ANGLE_SNAP_THRESHOLD = 0.005;
  static readonly PULSE_DURATION = 0.3;
  static readonly ARM_ANGLE_SPEED = 8;
  static readonly PULSE_EXPAND_R = 12;
  static readonly ARM_STROKE_WIDTH = 4;
  static readonly ARM_DOT_R = 7;
  static readonly STROKE_WIDTH = 3;

  activeIndex: number = 0;
  pulseTimer: number = 0;
  displayAngle: number | undefined = undefined;
  targetAngle: number | undefined = undefined;
  private _pt: LinePoint | null = null;
  private _enterAngle: number | undefined = undefined;
  private _allExitAngles: number[] = [];

  getActiveLinkId = () => this.linkIds[this.activeIndex] ?? null;

  cycle = () => {
    if (this.linkIds.length <= 1) return;
    this.activeIndex = (this.activeIndex + 1) % this.linkIds.length;
    this.activeLinkId = this.linkIds[this.activeIndex];
    this.pulseTimer = SwitchPreview.PULSE_DURATION;
  };

  setTargetAngle = (angle: number | undefined) => {
    if (angle === undefined) {
      this.targetAngle = undefined;
      this.displayAngle = undefined;
      return;
    }
    if (this.displayAngle === undefined) this.displayAngle = angle;
    this.targetAngle = angle;
  };

  tick = (deltaSeconds: number) => {
    if (this.pulseTimer > 0)
      this.pulseTimer = Math.max(0, this.pulseTimer - deltaSeconds);
    if (this.displayAngle !== undefined && this.targetAngle !== undefined) {
      this.displayAngle = animateAngle(
        this.displayAngle,
        this.targetAngle,
        SwitchPreview.ARM_ANGLE_SPEED,
        deltaSeconds,
      );
    }
  };

  prepareFrame = (lines: LinesRef, links: LinksRef, linkMap: LinkMapRef) => {
    const { RADIUS } = SwitchPreview;
    const ep = getSwitchEnterPoint(this.linkIds, links);
    if (!ep) { this._pt = null; return; }
    const line = lines[ep.lineId];
    if (!line) { this._pt = null; return; }
    const pt =
      ep.endpoint === "end"
        ? line.points[line.points.length - 1]
        : line.points[0];
    if (!pt) { this._pt = null; return; }
    this._pt = pt;

    this._enterAngle =
      curveIntersectAngle(line.points, ep.endpoint, pt.x, pt.y, RADIUS) ??
      (ep.endpoint === "end" ? pt.angle + Math.PI : pt.angle);

    this._allExitAngles = this.linkIds.flatMap((lid) => {
      const link = links[lid];
      if (!link) return [];
      const dest = (link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint) ? link.line2 : link.line1;
      const destLine = lines[dest.lineId];
      if (!destLine || destLine.points.length === 0) return [];
      const angle = curveIntersectAngle(destLine.points, dest.endpoint, pt.x, pt.y, RADIUS)
        ?? (dest.endpoint === "end" ? destLine.points[destLine.points.length - 1].angle + Math.PI : destLine.points[0].angle);
      return [angle];
    });

    const activeDest = linkMap[`${ep.lineId}::${ep.endpoint}`];
    if (activeDest) {
      const destLine = lines[activeDest.lineId];
      if (destLine && destLine.points.length > 0) {
        const activeAngle =
          curveIntersectAngle(destLine.points, activeDest.endpoint, pt.x, pt.y, RADIUS) ??
          (activeDest.endpoint === "end"
            ? destLine.points[destLine.points.length - 1].angle + Math.PI
            : destLine.points[0].angle);
        this.setTargetAngle(activeAngle);
      }
    }
  };

  applyToLinkMap = (links: LinksRef, linkMap: LinkMapRef) => {
    const ep = getSwitchEnterPoint(this.linkIds, links);
    if (!ep) return;
    const activeLinkId = this.getActiveLinkId();
    if (!activeLinkId) return;
    const link = links[activeLinkId];
    if (!link) return;
    const key = `${ep.lineId}::${ep.endpoint}`;
    linkMap[key] =
      link.line1.lineId === ep.lineId && link.line1.endpoint === ep.endpoint
        ? link.line2
        : link.line1;
  };

  getPoint = (): LinePoint | null => this._pt;

  hitTest = (x: number, y: number): boolean => {
    if (!this._pt) return false;
    const dx = x - this._pt.x;
    const dy = y - this._pt.y;
    const { HIT_RADIUS } = SwitchPreview;
    return dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS;
  };

  render = (
    lines: LinesRef,
    links: LinksRef,
    linkMap: LinkMapRef,
  ): JSX.Element | null => {
    this.prepareFrame(lines, links, linkMap);
    const pt = this.getPoint();
    if (!pt) return null;
    const {
      RADIUS: r,
      PULSE_DURATION,
      PULSE_EXPAND_R,
      ARM_STROKE_WIDTH,
      STROKE_WIDTH,
    } = SwitchPreview;
    const enterAngle = this._enterAngle;
    const displayAngle = this.displayAngle;

    return (
      <SVG.g key={this.id}>
        {this.pulseTimer > 0 && (() => {
          const t = 1 - this.pulseTimer / PULSE_DURATION;
          return (
            <SVG.circle
              cx={pt.x} cy={pt.y}
              r={r + t * PULSE_EXPAND_R}
              fill="none" stroke="#ccc"
              strokeWidth={STROKE_WIDTH}
              opacity={1 - t}
            />
          );
        })()}
        <SVG.circle cx={pt.x} cy={pt.y} r={r} fill="#f5f5f7" />
        {this._allExitAngles.map((angle, i) => (
          <SVG.g key={i}>{svgDot(pt.x + Math.cos(angle) * r, pt.y + Math.sin(angle) * r, "small")}</SVG.g>
        ))}
        {enterAngle !== undefined && (
          <>
            <SVG.line
              x1={pt.x} y1={pt.y}
              x2={pt.x + Math.cos(enterAngle) * r}
              y2={pt.y + Math.sin(enterAngle) * r}
              stroke="#ccc" strokeWidth={ARM_STROKE_WIDTH} strokeLinecap="round"
            />
            {svgDot(pt.x + Math.cos(enterAngle) * r, pt.y + Math.sin(enterAngle) * r, "big", this.color)}
          </>
        )}
        {displayAngle !== undefined && (
          <>
            <SVG.line
              x1={pt.x} y1={pt.y}
              x2={pt.x + Math.cos(displayAngle) * r}
              y2={pt.y + Math.sin(displayAngle) * r}
              stroke="#ccc" strokeWidth={ARM_STROKE_WIDTH} strokeLinecap="round"
            />
            {svgDot(pt.x + Math.cos(displayAngle) * r, pt.y + Math.sin(displayAngle) * r, "big", this.color)}
          </>
        )}
        <SVG.circle cx={pt.x} cy={pt.y} r={5} fill={this.color} />
      </SVG.g>
    );
  };
}
