import type Line from "engine/Line";
import type { Start } from "engine/Start";
import type { Ball } from "engine/Ball";
import { computeLinks } from "engine/Link";

export const serializeLevel = (
  lines: Line[],
  starts: Start[],
  balls: Ball[],
  linkActive: Record<string, boolean>,
) =>
  JSON.stringify(
    {
      lines: lines.map((l) => ({
        id: l.id,
        type: l.type,
        start: l.start,
        end: l.end,
        ...(l.control && { control: l.control }),
      })),
      links: computeLinks(lines, linkActive).map((lk) => ({
        id: lk.id,
        active: lk.active,
        line1: lk.line1,
        line2: lk.line2,
      })),
      starts: starts.map((s) => ({ id: s.id, position: s.position })),
      balls: balls.map((b) => ({ id: b.id, color: b.color })),
    },
    null,
    2,
  );
