import type { Point } from "engine/types";
import type { EditorMode } from "store/types";

export const dist = (a: Point, b: Point): number =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const getHint = (
  mode: EditorMode,
  pendingStart: Point | null,
  pendingEnd: Point | null,
): string | null => {
  if (mode === "addLine")
    return pendingStart ? "Click to set end point" : "Click to set start point";
  if (mode === "addCurve") {
    if (!pendingStart) return "Click to set start point";
    if (!pendingEnd) return "Click to set end point";
    return "Click to set control point";
  }
  if (mode === "addStart") return "Click on a line anchor";
  if (mode === "addArrival") return "Click on a line anchor";
  if (mode === "addSwitch") return "Click on a line anchor";
  return null;
};
