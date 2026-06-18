import type { LineType } from "engine/Line/Line";
import Link from "engine/Link";
import type { Anchor, LineRef, Point } from "engine/types";
import { Switch, SwitchEditor } from "engine/Switch";
import type { SwitchAnim } from "engine/Switch";
import { PainterEditor } from "engine/Painter";

type LineData = { id: string; type: LineType; start: Point; end: Point; control?: Point; color?: string };
type LinkData = { id: string; active: boolean; line1: LineRef; line2: LineRef };
type StartData = { id: string; position: LineRef; delay?: number };
type ArrivalData = { id: string; position: LineRef };
type SwitchData = { id: string; input: LineRef };
type PainterData = { id: string; input: LineRef; color: string };
type BallData = { id: string; color: string; speed: number };

export type LevelJSON = {
  lines: LineData[];
  links: LinkData[];
  starts: StartData[];
  arrivals?: ArrivalData[];
  switches?: SwitchData[];
  painters?: PainterData[];
  balls?: BallData[];
};

export type AnchorTarget = { id: string; anchor: Anchor };

export type RoutingTables = {
  links: Record<string, Link>;
  activePaths: Record<string, AnchorTarget>;
  allPaths: Record<string, AnchorTarget[]>;
  arrivalPaths: Record<string, string>;
  initialSwitchIndices: Record<string, number>;
  switches: Record<string, SwitchEditor>;
  painters: Record<string, PainterEditor>;
  painterMap: Record<string, string>;
};

export const buildRouting = (json: Pick<LevelJSON, "links" | "arrivals" | "switches" | "painters">): RoutingTables => {
  const links: Record<string, Link> = {};
  const activePaths: Record<string, AnchorTarget> = {};
  const allPaths: Record<string, AnchorTarget[]> = {};
  const arrivalPaths: Record<string, string> = {};
  const initialSwitchIndices: Record<string, number> = {};
  const switches: Record<string, SwitchEditor> = {};
  const painters: Record<string, PainterEditor> = {};
  const painterMap: Record<string, string> = {};

  for (const d of json.links) {
    links[d.id] = new Link(d.id, d.line1, d.line2, d.active);
    const k1 = `${d.line1.id}::${d.line1.anchor}`;
    const k2 = `${d.line2.id}::${d.line2.anchor}`;
    if (!allPaths[k1]) allPaths[k1] = [];
    if (!allPaths[k2]) allPaths[k2] = [];
    allPaths[k1].push({ id: d.line2.id, anchor: d.line2.anchor });
    allPaths[k2].push({ id: d.line1.id, anchor: d.line1.anchor });
    if (d.active) {
      activePaths[k1] = { id: d.line2.id, anchor: d.line2.anchor };
      activePaths[k2] = { id: d.line1.id, anchor: d.line1.anchor };
    }
  }

  for (const [key, targets] of Object.entries(allPaths)) {
    if (!activePaths[key] && targets.length > 0) activePaths[key] = targets[0];
  }

  for (const d of json.arrivals ?? []) {
    arrivalPaths[`${d.position.id}::${d.position.anchor}`] = d.id;
  }

  for (const d of json.switches ?? []) {
    const sw = new SwitchEditor(d.id, d.input);
    const key = `${d.input.id}::${d.input.anchor}`;
    const paths = allPaths[key] ?? [];
    const active = activePaths[key];
    if (active) {
      const idx = paths.findIndex((p) => p.id === active.id && p.anchor === active.anchor);
      if (idx >= 0) sw.activeIndex = idx;
    }
    switches[d.id] = sw;
    initialSwitchIndices[d.id] = sw.activeIndex;
  }

  for (const d of json.painters ?? []) {
    painters[d.id] = new PainterEditor(d.id, d.input, d.color);
    painterMap[`${d.input.id}::${d.input.anchor}`] = d.color;
  }

  return { links, activePaths, allPaths, arrivalPaths, initialSwitchIndices, switches, painters, painterMap };
};

const getOutputAngle = (
  target: AnchorTarget,
  lines: Record<string, { start: Point; end: Point }>,
): number | null => {
  const line = lines[target.id];
  if (!line) return null;
  const dx = target.anchor === "start" ? line.end.x - line.start.x : line.start.x - line.end.x;
  const dy = target.anchor === "start" ? line.end.y - line.start.y : line.start.y - line.end.y;
  return Math.atan2(dy, dx);
};

const chooseDiff = (fromAngle: number, toAngle: number, inputAngle: number | null): number => {
  let shortDiff = toAngle - fromAngle;
  while (shortDiff > Math.PI) shortDiff -= 2 * Math.PI;
  while (shortDiff < -Math.PI) shortDiff += 2 * Math.PI;
  if (inputAngle === null) return shortDiff;
  let rel = inputAngle - fromAngle;
  while (rel < 0) rel += 2 * Math.PI;
  while (rel >= 2 * Math.PI) rel -= 2 * Math.PI;
  const crosses = shortDiff >= 0 ? rel > 0 && rel < shortDiff : rel > 2 * Math.PI + shortDiff;
  if (!crosses) return shortDiff;
  return shortDiff >= 0 ? shortDiff - 2 * Math.PI : shortDiff + 2 * Math.PI;
};

export const cycleSwitch = (
  switchId: string,
  switches: Record<string, SwitchEditor>,
  activePaths: Record<string, AnchorTarget>,
  allPaths: Record<string, AnchorTarget[]>,
  switchAnims: Record<string, SwitchAnim>,
  lines: Record<string, { start: Point; end: Point }>,
): void => {
  const sw = switches[switchId];
  if (!sw) return;
  const key = `${sw.input.id}::${sw.input.anchor}`;
  const paths = allPaths[key];
  if (!paths || paths.length <= 1) return;
  const oldAngle = getOutputAngle(activePaths[key], lines);
  sw.activeIndex = (sw.activeIndex + 1) % paths.length;
  activePaths[key] = paths[sw.activeIndex];
  const newAngle = getOutputAngle(activePaths[key], lines);
  if (oldAngle !== null && newAngle !== null) {
    const inputAngle = getOutputAngle(sw.input, lines);
    const diff = chooseDiff(oldAngle, newAngle, inputAngle);
    switchAnims[switchId] = { fromAngle: oldAngle, diff, t: 0, duration: Switch.ANIM_DURATION_MS };
  }
};
