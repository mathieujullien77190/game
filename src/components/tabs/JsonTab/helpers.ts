import type Line from "engine/Line";
import type { Start } from "engine/Start";
import type { Arrival } from "engine/Arrival";
import type { Switch } from "engine/Switch";
import type { Painter } from "engine/Painter";
import type { Ball } from "engine/Ball";
import { computeLinks } from "engine/Link";

export const serializeLevel = (
  lines: Line[],
  starts: Start[],
  arrivals: Arrival[],
  switches: Switch[],
  painters: Painter[],
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
        color: l.color,
      })),
      links: computeLinks(lines, linkActive).map((lk) => ({
        id: lk.id,
        active: lk.active,
        line1: lk.line1,
        line2: lk.line2,
      })),
      starts: starts.map((s) => ({ id: s.id, position: s.position, delay: s.delay })),
      arrivals: arrivals.map((a) => ({ id: a.id, position: a.position })),
      switches: switches.map((s) => ({
        id: s.id,
        input: s.input,
      })),
      painters: painters.map((p) => ({
        id: p.id,
        input: p.input,
        color: p.color,
      })),
      balls: balls.map((b) => ({ id: b.id, color: b.color, speed: b.speed })),
    },
    null,
    2,
  );
