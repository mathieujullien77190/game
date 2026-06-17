import type Line from "engine/Line";
import { Link } from "./Link";
import type { Anchor, LineRef } from "engine/types";

const ANCHORS: Anchor[] = ["start", "end"];

const makeLinkId = (r1: LineRef, r2: LineRef): string => {
  const a = `${r1.id}.${r1.anchor}`;
  const b = `${r2.id}.${r2.anchor}`;
  return a < b ? `${a}--${b}` : `${b}--${a}`;
};

export const computeLinks = (
  lines: Line[],
  linkActive: Record<string, boolean> = {}
): Link[] => {
  const links: Link[] = [];

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const a = lines[i];
      const b = lines[j];

      for (const anchorA of ANCHORS) {
        for (const anchorB of ANCHORS) {
          if (a[anchorA].x === b[anchorB].x && a[anchorA].y === b[anchorB].y) {
            const ref1: LineRef = { id: a.id, anchor: anchorA };
            const ref2: LineRef = { id: b.id, anchor: anchorB };
            const id = makeLinkId(ref1, ref2);
            links.push(new Link(id, ref1, ref2, linkActive[id] ?? true));
          }
        }
      }
    }
  }

  return links;
};
