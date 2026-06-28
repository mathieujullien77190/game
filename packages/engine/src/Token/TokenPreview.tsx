import type { JSX, ReactNode } from "react";
import { POINT_SPACING, COLOR_BLACK, COLOR_RED, COLOR_BLUE } from "../constants";
import type { LinkEndpoint } from "../Link/Link";
import type { LinePreview } from "../Line/LinePreview";
import type { ArrivalPreview } from "../Arrival/ArrivalPreview";
import type { TransformerPreview } from "../Transformer/TransformerPreview";
import type { ScreenGatePreview } from "../ScreenGate/ScreenGatePreview";
import { Token } from "./Token";
import { rng } from "../utils";

export type TransitionCtx = {
  arrivalKey: string;
  arrival: ArrivalPreview | null;
  linkByEndpointKey: Record<string, string>;
  linkMap: Record<string, LinkEndpoint>;
  lines: Record<string, LinePreview>;
  transformers: Record<string, TransformerPreview>;
  transformerByLinkId: Record<string, string>;
  inverterLinkMap: Map<string, "invert" | "grayscale" | "dark">;
  isInverted: boolean;
  isGrayscale: boolean;
  isDark: boolean;
  screenGateByLinkId: Record<string, ScreenGatePreview>;
  screenGateByExitKey: Record<string, ScreenGatePreview>;
};

type ShapeData = {
  id: string;
  type: string;
  displayColor: string;
  color: unknown;
  direction: number;
  rotationOffset: number;
  currentSpeed: number;
};

const tokenShape = (
  data: ShapeData,
  x: number,
  y: number,
  angle: number,
): JSX.Element => {
  const {
    BASE_R,
    SQUARE_HALF_BASE,
    SQUARE_RX,
    PULSE_SPEED,
    PULSE_AMPLITUDE,
  } = TokenPreview;
  const phase =
    (parseInt(data.id.replace(/\D/g, "") || "0") * 1.7) % (Math.PI * 2);
  const pulse =
    1 + Math.sin(Date.now() / PULSE_SPEED + phase) * PULSE_AMPLITUDE;
  const color = data.displayColor || (data.color as string);
  const rot =
    (data.direction === -1 ? angle + Math.PI : angle) + data.rotationOffset;

  const moving = data.direction !== 0 && data.currentSpeed > 0;

  if (data.type === "cop") {
    const { COP_FLASH_SPEED, COP_COLOR_A, COP_COLOR_B } = TokenPreview;
    const flash = Math.sin((Date.now() / 1000) * Math.PI * COP_FLASH_SPEED) > 0;
    const copColor = flash ? COP_COLOR_A : COP_COLOR_B;
    const r = BASE_R / 1.6;
    return (
      <g>
        <circle cx={x} cy={y} r={r * 1.8} fill={copColor} opacity={0.1} />
        <circle cx={x} cy={y} r={r} fill={copColor} />
      </g>
    );
  }
  if (data.type === "square") {
    const hw = SQUARE_HALF_BASE * pulse;
    const hwBig = SQUARE_HALF_BASE * 1.8;
    const tf = `rotate(${(rot * 180) / Math.PI},${x},${y})`;
    return (
      <g>
        {moving && <rect
          x={x - hwBig} y={y - hwBig}
          width={hwBig * 2} height={hwBig * 2}
          rx={SQUARE_RX * 1.8}
          fill={color} opacity={0.1}
          transform={tf}
        />}
        <rect
          x={x - hw} y={y - hw}
          width={hw * 2} height={hw * 2}
          rx={SQUARE_RX}
          fill={color}
          transform={tf}
        />
      </g>
    );
  }
  return (
    <g>
      {moving && <circle cx={x} cy={y} r={BASE_R * 1.8} fill={color} opacity={0.1} />}
      <circle cx={x} cy={y} r={BASE_R * pulse} fill={color} />
    </g>
  );
};

const tokenTrail = (
  token: TokenPreview,
  line: LinePreview,
): JSX.Element | null => {
  const {
    TRAIL_SPEED_THRESHOLD,
    TRAIL_BASE_LEN,
    TRAIL_SPEED_LEN,
    TRAIL_SIZE_RATIO,
    TRAIL_OPACITY,
    BASE_R,
  } = TokenPreview;
  const speedDelta = token.currentSpeed - token.speed;
  if (
    speedDelta <= TRAIL_SPEED_THRESHOLD ||
    token.direction === 0 ||
    line.boost === 0
  )
    return null;
  const intensity = Math.min(speedDelta / 100, 1);
  const trailLen = Math.round(TRAIL_BASE_LEN + TRAIL_SPEED_LEN * intensity);
  const color = token.displayColor || (token.color as string);
  const pieces: ReactNode[] = [];
  for (let i = 1; i <= trailLen; i++) {
    const idx = token.pointIndex - token.direction * i;
    if (idx < 0 || idx >= line.points.length) break;
    const tpt = line.points[idx];
    const frac = 1 - i / (trailLen + 1);
    pieces.push(
      <circle
        key={i}
        cx={tpt.x}
        cy={tpt.y}
        r={BASE_R * frac * TRAIL_SIZE_RATIO}
        fill={color}
        opacity={frac * TRAIL_OPACITY}
      />,
    );
  }
  return <>{pieces}</>;
};

const tokenExplosion = (
  token: TokenPreview,
  x: number,
  y: number,
): JSX.Element => {
  const {
    EXPLOSION_PIECE_COUNT,
    EXPLOSION_SPEED_MIN,
    EXPLOSION_SPEED_RANGE,
    EXPLOSION_SIZE_MIN,
    EXPLOSION_SIZE_RANGE,
    EXPLOSION_BORDER_COUNT,
    EXPLOSION_BORDER_R,
    EXPLOSION_BORDER_STROKE_WIDTH,
    EXPLOSION_BORDER_ROT_SPEED,
  } = TokenPreview;
  const progress = token.explosionProgress;
  const fade = 1 - token.explosionFadeProgress;
  const color = token.displayColor || (token.color as string);
  const seed = token.explosionSeed;
  const isSquare = token.type === "square";
  const f = 1 - Math.pow(1 - progress, 4);
  const pieces: ReactNode[] = [];

  for (let k = 0; k < EXPLOSION_PIECE_COUNT; k++) {
    const angle = rng(seed, k) * Math.PI * 2;
    const speed = EXPLOSION_SPEED_MIN + rng(seed, k + 10) * EXPLOSION_SPEED_RANGE;
    const size = EXPLOSION_SIZE_MIN + rng(seed, k + 20) * EXPLOSION_SIZE_RANGE;
    const target = 0.2 + rng(seed, k + 25) * 0.8;
    const alpha = (1 - progress * (1 - target)) * fade;
    const px = x + Math.cos(angle) * f * speed;
    const py = y + Math.sin(angle) * f * speed;
    if (isSquare) {
      pieces.push(
        <rect key={`s${k}`} x={px - size} y={py - size} width={size * 2} height={size * 2} fill={color} opacity={alpha}/>,
      );
    } else {
      pieces.push(
        <circle key={`c${k}`} cx={px} cy={py} r={size} fill={color} opacity={alpha}/>,
      );
    }
  }

  for (let k = 0; k < EXPLOSION_BORDER_COUNT; k++) {
    const angle = rng(seed, k) * Math.PI * 2;
    const speed = EXPLOSION_SPEED_MIN + rng(seed, k + 10) * EXPLOSION_SPEED_RANGE;
    const target = 0.2 + rng(seed, k + 35) * 0.8;
    const alpha = (1 - progress * (1 - target)) * fade;
    const px = x + Math.cos(angle) * f * speed;
    const py = y + Math.sin(angle) * f * speed;
    const rotDir = rng(seed, k + 30) > 0.5 ? 1 : -1;
    const rot = angle + rotDir * progress * EXPLOSION_BORDER_ROT_SPEED;
    const r = EXPLOSION_BORDER_R;
    if (isSquare) {
      pieces.push(
        <line
          key={`bl${k}`}
          x1={px - r * Math.cos(rot)} y1={py - r * Math.sin(rot)}
          x2={px + r * Math.cos(rot)} y2={py + r * Math.sin(rot)}
          stroke={COLOR_BLACK} strokeWidth={EXPLOSION_BORDER_STROKE_WIDTH} opacity={alpha}
        />,
      );
    } else {
      const a0 = rot;
      const a1 = rot + Math.PI / 2;
      pieces.push(
        <path
          key={`ba${k}`}
          d={`M${px + r * Math.cos(a0)},${py + r * Math.sin(a0)}A${r},${r},0,0,1,${px + r * Math.cos(a1)},${py + r * Math.sin(a1)}`}
          fill="none" stroke={COLOR_BLACK} strokeWidth={EXPLOSION_BORDER_STROKE_WIDTH} opacity={alpha}
        />,
      );
    }
  }

  return <>{pieces}</>;
};

export class TokenPreview extends Token {
  // pulse animation
  static readonly PULSE_SPEED = 700;
  static readonly PULSE_AMPLITUDE = 0.13;
  // cop token
  static readonly COP_FLASH_SPEED = 4;
  static readonly COP_COLOR_A = COLOR_RED;
  static readonly COP_COLOR_B = COLOR_BLUE;
  // base shape
  static readonly BASE_R = 8;
  static readonly SQUARE_HALF_BASE = 8;
  static readonly SQUARE_RX = 3;
  static readonly STROKE_WIDTH = 2;
  // trail
  static readonly TRAIL_SPEED_THRESHOLD = 0.5;
  static readonly TRAIL_BASE_LEN = 10;
  static readonly TRAIL_SPEED_LEN = 30;
  static readonly TRAIL_SIZE_RATIO = 0.75;
  static readonly TRAIL_OPACITY = 0.55;
  // explosion — fill pieces
  static readonly EXPLOSION_PIECE_COUNT = 8;
  static readonly EXPLOSION_SPEED_MIN = 30;
  static readonly EXPLOSION_SPEED_RANGE = 70;
  static readonly EXPLOSION_SIZE_MIN = 2;
  static readonly EXPLOSION_SIZE_RANGE = 4;
  // explosion — border pieces (arcs for round, lines for square)
  static readonly EXPLOSION_BORDER_COUNT = 4;
  static readonly EXPLOSION_BORDER_R = 8;
  static readonly EXPLOSION_BORDER_STROKE_WIDTH = 2;
  static readonly EXPLOSION_BORDER_ROT_SPEED = Math.PI * 0.5;

  startId: string = "";
  lineId: string = "";
  pointIndex: number = 0;
  remainder: number = 0;
  direction: 1 | -1 | 0 = 1;
  startAt: number = 0;
  currentSpeed: number = 0;
  rotationOffset: number = 0;
  targetRotationOffset: number = 0;
  colorTransitionFrom: string = "";
  displayColor: string = "";
  colorProgress: number = 1;
  opacity: number = 1;
  arrived: boolean = false;
  isTransforming: boolean = false;
  transformProgress: number = 0;
  transformingLinkId: string = "";
  transformMode: "color" | "shape" = "shape";
  pendingType: string = "round";
  pendingLineId: string = "";
  pendingPointIndex: number = 0;
  pendingDirection: 1 | -1 = 1;
  pendingRemainder: number = 0;
  portalContext: {
    returnLineId: string;
    returnPointIndex: number;
    returnDirection: 1 | -1;
    returnRemainder: number;
  } | null = null;
  speedingLineId: string = "";
  exploding: boolean = false;
  explosionProgress: number = 0;
  explosionFadeProgress: number = 0;
  explosionSeed: number = 0;

  transition = (
    arrivedAt: "start" | "end",
    excess: number,
    ctx: TransitionCtx,
  ): { isInverted: boolean; isGrayscale: boolean; isDark: boolean } => {
    let isInverted = ctx.isInverted;
    let isGrayscale = ctx.isGrayscale;
    let isDark = ctx.isDark;

    if (this.portalContext) {
      const exitGate = ctx.screenGateByExitKey[`${this.lineId}::${arrivedAt}`];
      if (exitGate) {
        this.lineId = this.portalContext.returnLineId;
        this.pointIndex = this.portalContext.returnPointIndex;
        this.direction = this.portalContext.returnDirection;
        this.remainder = this.portalContext.returnRemainder;
        this.portalContext = null;
        return { isInverted, isGrayscale, isDark };
      }
    }

    if (ctx.arrivalKey && ctx.arrivalKey === `${this.lineId}::${arrivedAt}`) {
      if (ctx.arrival) {
        ctx.arrival.isFading = true;
        ctx.arrival.fadeAlpha = 1;
      }
      this.arrived = true;
      this.direction = 0;
      return { isInverted, isGrayscale, isDark };
    }

    const linkId = ctx.linkByEndpointKey[`${this.lineId}::${arrivedAt}`];
    const transformer = linkId
      ? ctx.transformers[ctx.transformerByLinkId[linkId]]
      : undefined;
    if (transformer?.type === "rotate")
      this.targetRotationOffset += Math.PI * 2.25;
    if (transformer?.type === "fade") this.opacity = transformer.amount;
    const inverterEffect = linkId ? ctx.inverterLinkMap.get(linkId) : undefined;
    if (inverterEffect === "invert") isInverted = !isInverted;
    else if (inverterEffect === "grayscale") isGrayscale = !isGrayscale;
    else if (inverterEffect === "dark") isDark = !isDark;

    const screenGate = linkId ? ctx.screenGateByLinkId[linkId] : undefined;
    if (screenGate) {
      const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
      if (other) {
        const returnLine = ctx.lines[other.lineId];
        this.portalContext = {
          returnLineId: other.lineId,
          returnPointIndex:
            other.endpoint === "start"
              ? 0
              : (returnLine?.points.length ?? 1) - 1,
          returnDirection: other.endpoint === "start" ? 1 : -1,
          returnRemainder: excess,
        };
      }
      const [entryLineId, entryEndpoint] = screenGate.entryKey.split("::");
      const entryLine = ctx.lines[entryLineId];
      if (entryLine) {
        this.lineId = entryLineId;
        this.pointIndex =
          entryEndpoint === "start" ? 0 : entryLine.points.length - 1;
        this.direction = entryEndpoint === "start" ? 1 : -1;
        this.remainder = excess;
      }
      return { isInverted, isGrayscale, isDark };
    }

    if (transformer?.type === "color" || transformer?.type === "shape") {
      const currentColor = this.displayColor || (this.color as string);
      const needsColor =
        transformer.type === "color" && currentColor !== transformer.color;
      const needsShape =
        transformer.type === "shape" &&
        (this.type as string) !== transformer.targetType;
      if (needsColor || needsShape) {
        this.isTransforming = true;
        this.transformProgress = 0;
        this.transformingLinkId = linkId;
        this.transformMode = transformer.type;
        this.direction = 0;
        this.currentSpeed = this.speed;
        transformer.transformProgress = 0;
        if (needsColor) {
          this.colorTransitionFrom = currentColor;
          this.color = transformer.color as any;
          this.colorProgress = 0;
        }
        if (needsShape) {
          this.pendingType = transformer.targetType;
        }
        const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
        if (other) {
          const newLine = ctx.lines[other.lineId];
          this.pendingLineId = other.lineId;
          this.pendingPointIndex =
            other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
          this.pendingDirection = other.endpoint === "start" ? 1 : -1;
          this.pendingRemainder = excess;
        } else {
          const line = ctx.lines[this.lineId];
          this.pointIndex =
            arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0;
          this.remainder = 0;
          this.pendingLineId = "";
        }
        return { isInverted, isGrayscale, isDark };
      }
    }

    const other = ctx.linkMap[`${this.lineId}::${arrivedAt}`];
    if (other) {
      this.lineId = other.lineId;
      const newLine = ctx.lines[this.lineId];
      this.pointIndex =
        other.endpoint === "start" ? 0 : (newLine?.points.length ?? 1) - 1;
      this.direction = other.endpoint === "start" ? 1 : -1;
      this.remainder = excess;
    } else {
      const line = ctx.lines[this.lineId];
      this.pointIndex =
        arrivedAt === "end" ? (line?.points.length ?? 1) - 1 : 0;
      this.remainder = 0;
      this.direction = 0;
    }

    return { isInverted, isGrayscale, isDark };
  };

  advance = (
    deltaSeconds: number,
    pointCount: number,
  ): { hit: "start" | "end"; excess: number } | null => {
    let budget = Math.max(1, this.currentSpeed) * deltaSeconds + this.remainder;
    const maxIndex = pointCount - 1;
    while (budget >= POINT_SPACING) {
      budget -= POINT_SPACING;
      const next = this.pointIndex + this.direction;
      if (next > maxIndex) return { hit: "end", excess: budget };
      if (next < 0) return { hit: "start", excess: budget };
      this.pointIndex = next;
    }
    this.remainder = budget;
    return null;
  };

  renderShape = (x: number, y: number, angle: number): JSX.Element =>
    tokenShape(this, x, y, angle);

  render = (
    pt: { x: number; y: number; angle: number },
    line: LinePreview,
  ): JSX.Element => {
    if (this.exploding) {
      return <g key={this.id}>{tokenExplosion(this, pt.x, pt.y)}</g>;
    }
    const isShapeTransforming =
      this.isTransforming &&
      this.transformProgress > 0 &&
      this.transformMode === "shape";
    return (
      <g key={this.id} opacity={this.opacity}>
        {tokenTrail(this, line)}
        {isShapeTransforming ? (
          <>
            <g opacity={1 - this.transformProgress}>
              {tokenShape(this, pt.x, pt.y, pt.angle)}
            </g>
            <g opacity={this.transformProgress}>
              {tokenShape(
                { ...this, type: this.pendingType },
                pt.x,
                pt.y,
                pt.angle,
              )}
            </g>
          </>
        ) : (
          tokenShape(this, pt.x, pt.y, pt.angle)
        )}
      </g>
    );
  };
}
