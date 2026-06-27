import type { JSX } from "react"
import { Line } from "./Line"
import { linePath } from "./lineUtils"
import { COLOR_TOKEN_YELLOW, COLOR_TOKEN_BLUE } from "../constants"
import type { Point } from "../types"

const lineMid = (line: LineEditor): Point => {
  if (line.type === "curve" || line.type === "elbow") {
    const { start: s, end: e, cp1, cp2 } = line
    return {
      x: 0.125 * s.x + 0.375 * cp1.x + 0.375 * cp2.x + 0.125 * e.x,
      y: 0.125 * s.y + 0.375 * cp1.y + 0.375 * cp2.y + 0.125 * e.y,
    }
  }
  if (line.points.length > 0) {
    const mid = line.points[Math.floor(line.points.length / 2)]
    return { x: mid.x, y: mid.y }
  }
  return { x: (line.start.x + line.end.x) / 2, y: (line.start.y + line.end.y) / 2 }
}

export class LineEditor extends Line {
  static readonly GUIDE_STROKE = "#ccc"
  static readonly GUIDE_STROKE_WIDTH = 1
  static readonly GUIDE_DASH = "3 3"
  static readonly CP1_COLOR = "#4caf50"
  static readonly CP2_COLOR = "#9c27b0"
  static readonly CP_R = 5
  static readonly CORNER_R = 5
  static readonly CORNER_STROKE = "#666"
  static readonly CORNER_STROKE_WIDTH = 1.5
  static readonly START_R = 5
  static readonly START_COLOR = COLOR_TOKEN_YELLOW
  static readonly END_R = 7
  static readonly END_COLOR = COLOR_TOKEN_BLUE
  static readonly LINE_STROKE = "#999"
  static readonly LINE_STROKE_HOVERED = "#000"
  static readonly LINE_STROKE_WIDTH = 2
  static readonly LINE_STROKE_WIDTH_HOVERED = 3
  static readonly LINE_DASH = "6 5"
  static readonly LABEL_FONT_SIZE = 10
  static readonly LABEL_OFFSET_Y = 10
  static readonly LABEL_COLOR = "#333"

  render = (hovered: boolean, showIds: boolean): JSX.Element => {
    const {
      GUIDE_STROKE, GUIDE_STROKE_WIDTH, GUIDE_DASH,
      CP1_COLOR, CP2_COLOR, CP_R,
      CORNER_R, CORNER_STROKE, CORNER_STROKE_WIDTH,
      START_R, START_COLOR, END_R, END_COLOR,
      LINE_STROKE, LINE_STROKE_HOVERED, LINE_STROKE_WIDTH, LINE_STROKE_WIDTH_HOVERED, LINE_DASH,
      LABEL_FONT_SIZE, LABEL_OFFSET_Y, LABEL_COLOR,
    } = LineEditor
    const mid = showIds ? lineMid(this) : null
    const corner =
      this.type === "elbow"
        ? this.flip
          ? { x: this.end.x, y: this.start.y }
          : { x: this.start.x, y: this.end.y }
        : null
    return (
      <g key={this.id}>
        {this.type === "curve" && (
          <>
            <line
              x1={this.start.x} y1={this.start.y} x2={this.cp1.x} y2={this.cp1.y}
              stroke={GUIDE_STROKE} strokeWidth={GUIDE_STROKE_WIDTH} strokeDasharray={GUIDE_DASH}
            />
            <line
              x1={this.end.x} y1={this.end.y} x2={this.cp2.x} y2={this.cp2.y}
              stroke={GUIDE_STROKE} strokeWidth={GUIDE_STROKE_WIDTH} strokeDasharray={GUIDE_DASH}
            />
          </>
        )}
        <path
          d={linePath(this)}
          fill="none"
          stroke={hovered ? LINE_STROKE_HOVERED : LINE_STROKE}
          strokeWidth={hovered ? LINE_STROKE_WIDTH_HOVERED : LINE_STROKE_WIDTH}
          strokeDasharray={LINE_DASH}
          strokeLinecap="round"
        />
        {this.type === "curve" && (
          <>
            <circle cx={this.cp1.x} cy={this.cp1.y} r={CP_R} fill={CP1_COLOR}/>
            <circle cx={this.cp2.x} cy={this.cp2.y} r={CP_R} fill={CP2_COLOR}/>
          </>
        )}
        {corner && (
          <circle cx={corner.x} cy={corner.y} r={CORNER_R} fill="#fff" stroke={CORNER_STROKE} strokeWidth={CORNER_STROKE_WIDTH}/>
        )}
        <circle cx={this.start.x} cy={this.start.y} r={START_R} fill={START_COLOR}/>
        <circle cx={this.end.x} cy={this.end.y} r={END_R} fill={END_COLOR}/>
        {mid && (
          <text
            x={mid.x} y={mid.y - LABEL_OFFSET_Y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="monospace"
            fontSize={LABEL_FONT_SIZE}
            fontWeight="bold"
            fill={LABEL_COLOR}
          >
            {this.id}
          </text>
        )}
      </g>
    )
  }
}
