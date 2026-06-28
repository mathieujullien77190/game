import type { JSX } from "react";
import { Line } from "./Line";
import { linePath } from "./lineUtils";
import {
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_DARK_GRAY,
  COLOR_RED,
  COLOR_ORANGE_GLOW,
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
  static readonly BOOST_WIN_RATIO = 0.3;
  static readonly BOOST_ANIM_SPEED = 4;
  static readonly BOOST_GLOW_COLOR = COLOR_ORANGE_GLOW;
  static readonly BOOST_STROKE_WIDTH = 2;
  static readonly TUNNEL_DOT_R = 4;
  static readonly LINE_STROKE = COLOR_DARK_GRAY;
  static readonly LINE_STROKE_WIDTH = 3;
  static readonly SPEED_BOX_W = 26;
  static readonly SPEED_BOX_H = 19;
  static readonly SPEED_BOX_RX = 4;
  static readonly SPEED_FONT_SIZE = 9;
  static readonly LIMIT_R = 11;
  static readonly LIMIT_OFFSET_X = 24;

  lastSpeed: number | undefined = undefined;

  render = (elapsed: number): JSX.Element => {
    const {
      BOOST_WIN_RATIO,
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
      const winSize = Math.max(2, Math.floor(total * BOOST_WIN_RATIO));
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
        <path
          d={d}
          fill="none"
          stroke={BOOST_GLOW_COLOR}
          strokeWidth={BOOST_STROKE_WIDTH}
          strokeLinecap="round"
          filter="url(#pv-boost-blur)"
        />
      );
    })();

    return (
      <g key={this.id}>
        {boostGlow}
        {this.tunnel ? (
          <>
            <circle
              cx={this.start.x}
              cy={this.start.y}
              r={TUNNEL_DOT_R}
              fill={COLOR_BLACK}
            />
            <circle
              cx={this.end.x}
              cy={this.end.y}
              r={TUNNEL_DOT_R}
              fill={COLOR_BLACK}
            />
          </>
        ) : (
          <path
            d={linePath(this)}
            fill="none"
            stroke={LINE_STROKE}
            strokeWidth={LINE_STROKE_WIDTH}
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  renderOverlay = (token?: TokenPreview): JSX.Element | null => {
    if (!this.showSpeed && this.limitation === 0) return null;
    const {
      SPEED_BOX_W,
      SPEED_BOX_H,
      SPEED_BOX_RX,
      SPEED_FONT_SIZE,
      LIMIT_R,
      LIMIT_OFFSET_X,
    } = LinePreview;
    const mid = lineMid(this);
    const speed = token?.currentSpeed;
    const tokenColor = token
      ? token.displayColor || (token.color as string)
      : undefined;
    if (speed !== undefined) this.lastSpeed = speed;

    return (
      <g key={`ov-${this.id}`}>
        {this.showSpeed && (
          <g>
            <rect
              x={mid.x - SPEED_BOX_W / 2}
              y={mid.y - SPEED_BOX_H / 2}
              width={SPEED_BOX_W}
              height={SPEED_BOX_H}
              rx={SPEED_BOX_RX}
              fill={tokenColor ?? COLOR_WHITE}
              stroke={COLOR_BLACK}
              strokeWidth={1.5}
            />
            <text
              x={mid.x}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize={SPEED_FONT_SIZE}
              fontWeight="bold"
              fill={COLOR_BLACK}
            >
              {this.lastSpeed !== undefined ? Math.round(this.lastSpeed) : ""}
            </text>
          </g>
        )}
        {this.limitation !== 0 && (
          <g>
            <circle
              cx={mid.x + (this.showSpeed ? LIMIT_OFFSET_X : 0)}
              cy={mid.y}
              r={LIMIT_R}
              fill={COLOR_WHITE}
              stroke={COLOR_RED}
              strokeWidth={2}
            />
            <text
              x={mid.x + (this.showSpeed ? LIMIT_OFFSET_X : 0)}
              y={mid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize={SPEED_FONT_SIZE}
              fontWeight="bold"
              fill={COLOR_BLACK}
            >
              {this.limitation}
            </text>
          </g>
        )}
      </g>
    );
  };
}
