import Link from "engine/Link";
import type { AnchorEntry } from "./types";

export const buildAnchorMap = (links: Link[]) => {
  const map: Record<string, { start: AnchorEntry[]; end: AnchorEntry[] }> = {};

  for (const link of links) {
    if (!map[link.line1.id]) map[link.line1.id] = { start: [], end: [] };
    map[link.line1.id][link.line1.anchor].push({
      lineId: link.line2.id,
      linkId: link.id,
      active: link.active,
    });

    if (!map[link.line2.id]) map[link.line2.id] = { start: [], end: [] };
    map[link.line2.id][link.line2.anchor].push({
      lineId: link.line1.id,
      linkId: link.id,
      active: link.active,
    });
  }

  return map;
};
