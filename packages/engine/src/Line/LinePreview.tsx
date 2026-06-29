import type { JSX } from "react";
import * as SVG from "../svgElements"
import { Line } from "./Line";
import { linePath } from "./lineUtils";
import { POINT_SPACING } from "../constants";
import { svgDot } from "../svgDot";
import {
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_DARK_GRAY,
  COLOR_RED,
  COLOR_ORANGE_GLOW,
  COLOR_TOKEN_ORANGE,
  GAME_FONT,
} from "../constants";
import type { TokenPreview } from "../Token/TokenPreview";

const lineMid = (line: LinePreview) => {
  if (line.points.length === 0)
    return {
      x: (line.start.x + line.end.x) / 2,
      y: (line.start.y + line.end.y) / 2,
    };
  const mid = line.points[Math.floor(line.points.length / 2)];
  return { x: mid.x, y: mid.y };
};

export class LinePreview extends Line {
  static readonly BOOST_WIN_PX = 80;
  static readonly BOOST_ANIM_SPEED = 4;
  static readonly BOOST_GLOW_COLOR = COLOR_ORANGE_GLOW;
  static readonly BOOST_STROKE_WIDTH = 3;
  static readonly TUNNEL_DOT_R = 7;
  static readonly LINE_STROKE = "#ccc";
  static readonly LINE_STROKE_WIDTH = 6;
  static readonly SPEED_BOX_W = 26;
  static readonly SPEED_BOX_H = 19;
  static readonly SPEED_BOX_RX = 4;
  static readonly SPEED_FONT_SIZE = 12;
  static readonly LIMIT_R = 15;
  static readonly LIMIT_OFFSET_X = 24;

  lastSpeed: number | undefined = undefined;
  private wasSpeeding = false;
  private limitFlashStart = -999;

  render = (elapsed: number): JSX.Element => {
    const {
      BOOST_WIN_PX,
      BOOST_ANIM_SPEED,
      BOOST_GLOW_COLOR,
      BOOST_STROKE_WIDTH,
      TUNNEL_DOT_R,
      LINE_STROKE,
      LINE_STROKE_WIDTH,
    } = LinePreview;
    const boostGlow = (() => {
      if (this.boost === 0 || this.points.length < 2) return null;
      const total = this.points.length;
      const winSize = Math.max(2, Math.floor(BOOST_WIN_PX / POINT_SPACING));
      const cycle = total + winSize;
      const rawOffset =
        Math.floor(
          (elapsed * Math.abs(this.boost) * BOOST_ANIM_SPEED) % cycle,
        ) - winSize;
      const tail = Math.max(rawOffset, 0);
      const head = Math.min(rawOffset + winSize, total - 1);
      if (tail >= head) return null;
      const pts = this.points.slice(tail, head + 1);
      const d =
        `M${pts[0].x},${pts[0].y}` +
        pts
          .slice(1)
          .map((p) => `L${p.x},${p.y}`)
          .join("");
      return (
        <SVG.path
          d={d}
          fill="none"
          stroke="orange"
          strokeWidth={BOOST_STROKE_WIDTH}
          strokeLinecap="round"
          opacity={0.8}
        />
      );
    })();

    return (
      <SVG.g key={this.id}>
        {!this.tunnel && (
          <SVG.path
            d={linePath(this)}
            fill="none"
            stroke={LINE_STROKE}
            strokeWidth={LINE_STROKE_WIDTH}
            strokeLinecap="round"
          />
        )}
        {boostGlow}
      </SVG.g>
    );
  };

  renderTunnelDots = (): JSX.Element | null => {
    if (!this.tunnel) return null;
    return (
      <SVG.g key={`td-${this.id}`}>
        {svgDot(this.start.x, this.start.y, "small")}
        {svgDot(this.end.x, this.end.y, "small")}
      </SVG.g>
    );
  };

  renderOverlay = (tokens: TokenPreview[], elapsed: number): JSX.Element | null => {
    if (!this.showSpeed && this.limitation === 0) return null;
    const OFFSET = 36;
    const W = 26, H = 18, RX = 3, AW = 4, AH = 5;
    const offsetMap: Record<string, [number, number]> = {
      right: [OFFSET, 0], left: [-OFFSET, 0], top: [0, -OFFSET], bottom: [0, OFFSET],
    };
    const arrowPoints = (pos: string, cx: number, cy: number) => {
      if (pos === "top")    return `${cx - AW},${cy + H/2} ${cx + AW},${cy + H/2} ${cx},${cy + H/2 + AH}`;
      if (pos === "bottom") return `${cx - AW},${cy - H/2} ${cx + AW},${cy - H/2} ${cx},${cy - H/2 - AH}`;
      if (pos === "left")   return `${cx + W/2},${cy - AW} ${cx + W/2},${cy + AW} ${cx + W/2 + AH},${cy}`;
      if (pos === "right")  return `${cx - W/2},${cy - AW} ${cx - W/2},${cy + AW} ${cx - W/2 - AH},${cy}`;
      return "";
    };
    const { SPEED_FONT_SIZE, LIMIT_R } = LinePreview;
    const mid = lineMid(this);
    const isSpeeding = this.limitation > 0 && tokens.some((t) => t.type !== "cop" && t.currentSpeed > this.limitation);
    if (isSpeeding && !this.wasSpeeding) this.limitFlashStart = elapsed;
    this.wasSpeeding = isSpeeding;
    const flashOn = elapsed - this.limitFlashStart < 0.35;

    return (
      <SVG.g key={`ov-${this.id}`}>
        {this.showSpeed && tokens.filter((t) => t.type !== "cop").map((token) => {
          const pt = this.points[token.pointIndex];
          if (!pt) return null;
          const [ox, oy] = offsetMap[this.showSpeed] ?? [0, -OFFSET];
          const cx = pt.x + ox;
          const cy = pt.y + oy;
          return (
            <SVG.g key={token.id}>
              <SVG.rect x={cx - W/2} y={cy - H/2} width={W} height={H} rx={RX} fill={COLOR_WHITE} />
              <SVG.polygon points={arrowPoints(this.showSpeed, cx, cy)} fill={COLOR_WHITE} />
              <SVG.text
                x={cx} y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily={GAME_FONT}
                fontSize={SPEED_FONT_SIZE}
                fontWeight="bold"
                fill={COLOR_DARK_GRAY}
              >
                {Math.round(token.currentSpeed)}
              </SVG.text>
            </SVG.g>
          );
        })}
        {this.limitation !== 0 && (
          <SVG.g>
            <SVG.circle cx={mid.x} cy={mid.y} r={LIMIT_R} fill={COLOR_WHITE} stroke={flashOn ? COLOR_RED : "#ccc"} strokeWidth={3} />
            <SVG.text
              x={mid.x} y={mid.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={GAME_FONT}
              fontSize={SPEED_FONT_SIZE}
              fontWeight="bold"
              fill={COLOR_DARK_GRAY}
            >
              {this.limitation}
            </SVG.text>
          </SVG.g>
        )}
      </SVG.g>
    );
  };
}
