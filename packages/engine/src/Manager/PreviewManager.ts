import type { Renderer } from "../render/Renderer"
import { ACCEL_TIME, PAINT_DURATION, ROTATION_SPEED, CANVAS_W, CANVAS_H } from "../constants";

const EXPLOSION_DURATION = 2;
// Constante de lissage du fondu d'opacité d'un token (cf. TokenPreview.fadingOpacity,
// utilisé par le Cloner pour matérialiser un clone / faire disparaître le token consommé).
const OPACITY_FADE_TAU = 0.4;

import { LinePreview } from "../entities/Line/LinePreview";
import type { Link, LinkEndpoint } from "../entities/Link/Link";
import type { Start } from "../entities/Start/Start";
import { StartPreview } from "../entities/Start/StartPreview";
import type { Switch } from "../entities/Switch/Switch";
import { SwitchPreview } from "../entities/Switch/SwitchPreview";
import { getSwitchEnterPoint } from "../entities/Switch/switchUtils";
import type { Cloner } from "../entities/Cloner/Cloner";
import { ClonerPreview } from "../entities/Cloner/ClonerPreview";
import { drawStats, smoothFps } from "../stats";
import { TokenPreview } from "../entities/Token/TokenPreview";
import type { Inverter } from "../entities/Inverter/Inverter";
import { InverterPreview } from "../entities/Inverter/InverterPreview";
import type { Transformer } from "../entities/Transformer/Transformer";
import { TransformerPreview } from "../entities/Transformer/TransformerPreview";
import { setAnimationsEnabled, areAnimationsEnabled } from "../entities/Animation";
import type { ScreenGate } from "../entities/ScreenGate/ScreenGate";
import { ScreenGatePreview } from "../entities/ScreenGate/ScreenGatePreview";
import type { Arrival } from "../entities/Arrival/Arrival";
import { ArrivalPreview } from "../entities/Arrival/ArrivalPreview";
import { COLORS, STROKE_WIDTHS } from "../theme";
import { approach, lerpHex } from "../Utils/numeric";
import { distanceSq } from "../Utils/geometry";
import { Manager } from "./Manager";
import { Profiler } from "../Profiler";
import type { SimEvent } from "./simEvents";

// Constante de build : injectée par `define` dans les configs Vite (vraie en dev/edition, fausse
// dans le build webview mobile). `typeof` évite un ReferenceError si un consommateur ne la définit
// pas (fallback silencieux, profiling désactivé). Une fois repliée en `false` par le bundler,
// esbuild élimine chaque `if (PROFILING)` ci-dessous — et donc tout l'import de Profiler — du
// bundle mobile, cf. `../CLAUDE.md`.
declare global {
  const __TICTACTIC_PROFILING__: boolean | undefined
}
const PROFILING = typeof __TICTACTIC_PROFILING__ !== "undefined" && __TICTACTIC_PROFILING__;

type LinkMap = Record<string, LinkEndpoint>;

export class PreviewManager extends Manager<LinePreview> {
  data = {
    lines: {} as Record<string, LinePreview>,
    tokens: [] as TokenPreview[],
    starts: [] as StartPreview[],
    switches: {} as Record<string, SwitchPreview>,
    switchByEnterKey: {} as Record<string, SwitchPreview>,
    switchLinks: {} as Record<string, string[]>,
    cloners: {} as Record<string, ClonerPreview>,
    clonerByEnterKey: {} as Record<string, ClonerPreview>,
    links: {} as Record<string, Link>,
    linkMap: {} as LinkMap,
    transformers: {} as Record<string, TransformerPreview>,
    transformerByLinkId: {} as Record<string, string>,
    linkByEndpointKey: {} as Record<string, string>,
    inverters: {} as Record<string, InverterPreview>,
    inverterLinkMap: new Map<string, "invert" | "grayscale" | "dark">(),
    isInverted: false,
    isGrayscale: false,
    isDark: false,
    screenGates: {} as Record<string, ScreenGatePreview>,
    screenGateByLinkId: {} as Record<string, ScreenGatePreview>,
    screenGateByExitKey: {} as Record<string, ScreenGatePreview>,
    previewScreenId: "main" as string,
    previewScreenHistory: [] as string[],
    screenTimeMultipliers: {} as Record<string, number>,
    arrivals: [] as ArrivalPreview[],
    arrivalByKey: {} as Record<string, ArrivalPreview>,
    elapsedSeconds: 0,
    lastTimestamp: null as number | null,
    fps: 0,
    frameMs: 0,
    // File d'événements de la simulation, vidée par le frontend via drainEvents().
    events: [] as SimEvent[],
  };

  // Affiche le compteur fps/tokens en bas à gauche du canvas (debug). Un frontend peut le couper.
  hudStatsEnabled = true;

  // Rend et vide la file d'événements émis depuis le dernier appel.
  drainEvents = (): SimEvent[] => {
    const evs = this.data.events;
    this.data.events = [];
    return evs;
  };

  // Coupe toutes les animations d'entités en un seul point (debug / perf). Le rendu
  // statique (nœuds, rails, tokens) reste ; seule la couche animée est sautée.
  // Délègue au flag module de `Animation.ts` (toutes les entités passent par
  // `runAnimations`), donc un seul booléen gèle l'animation de tout le jeu.
  get animationsEnabled() { return areAnimationsEnabled(); }
  set animationsEnabled(v: boolean) { setAnimationsEnabled(v); }

  initSimulation = (
    links: Record<string, Link>,
    starts: Record<string, Start>,
    switches: Record<string, Switch> = {},
    switchLinks: Record<string, string[]> = {},
    transformers: Record<string, Transformer> = {},
    arrivals: Record<string, Arrival> = {},
    inverters: Record<string, Inverter> = {},
    screenGates: Record<string, ScreenGate> = {},
    screenTimeMultipliers: Record<string, number> = {},
    cloners: Record<string, Cloner> = {},
  ) => {
    if (PROFILING) Profiler.reset();
    this.data.switchLinks = switchLinks;
    this.data.links = links;
    this.data.linkMap = {};
    this.data.elapsedSeconds = 0;
    this.data.lastTimestamp = null;
    this.data.events = [];

    this.data.linkByEndpointKey = {};
    for (const lk of Object.values(links)) {
      const k1 = `${lk.line1.lineId}::${lk.line1.endpoint}`;
      const k2 = `${lk.line2.lineId}::${lk.line2.endpoint}`;
      this.data.linkByEndpointKey[k1] = lk.id;
      this.data.linkByEndpointKey[k2] = lk.id;
      if (!lk.activated) continue;
      this.data.linkMap[k1] = lk.line2;
      this.data.linkMap[k2] = lk.line1;
    }

    this.data.transformers = {};
    this.data.transformerByLinkId = {};
    for (const tr of Object.values(transformers)) {
      const tp = new TransformerPreview(tr.linkId, tr.type, tr.id, tr.amount, tr.color, tr.targetType);
      this.data.transformers[tp.id] = tp;
      this.data.transformerByLinkId[tr.linkId] = tp.id;
    }

    this.data.switches = {};
    this.data.switchByEnterKey = {};
    for (const s of Object.values(switches)) {
      const sw = new SwitchPreview(s.id, s.linkIds, s.activeLinkId, s.screenId, s.color, s.mode);
      if (s.activeLinkId) {
        const idx = s.linkIds.indexOf(s.activeLinkId);
        if (idx !== -1) sw.activeIndex = idx;
      }
      sw.applyToLinkMap(links, this.data.linkMap);
      this.data.switches[s.id] = sw;
      const ep = getSwitchEnterPoint(s.linkIds, links);
      if (ep) this.data.switchByEnterKey[`${ep.lineId}::${ep.endpoint}`] = sw;
    }

    this.data.cloners = {};
    this.data.clonerByEnterKey = {};
    for (const c of Object.values(cloners)) {
      const cp = new ClonerPreview(c.id, c.linkIds, c.screenId);
      this.data.cloners[c.id] = cp;
      const ep = getSwitchEnterPoint(c.linkIds, links);
      if (ep) this.data.clonerByEnterKey[`${ep.lineId}::${ep.endpoint}`] = cp;
    }

    this.data.inverters = {};
    this.data.inverterLinkMap = new Map();
    this.data.isInverted = false;
    this.data.isGrayscale = false;
    this.data.isDark = false;
    for (const inv of Object.values(inverters)) {
      const invPreview = new InverterPreview(inv.linkId, inv.id);
      invPreview.effect = inv.effect;
      this.data.inverters[inv.id] = invPreview;
      this.data.inverterLinkMap.set(inv.linkId, inv.effect);
    }

    this.data.screenGates = {};
    this.data.screenGateByLinkId = {};
    this.data.screenGateByExitKey = {};
    this.data.previewScreenId = "main";
    this.data.previewScreenHistory = [];
    this.data.screenTimeMultipliers = screenTimeMultipliers;
    for (const sg of Object.values(screenGates)) {
      const sgp = new ScreenGatePreview(sg.linkId, sg.targetScreenId, sg.entryKey, sg.exitKey, sg.id, sg.screenId);
      sgp.timeMultiplier = screenTimeMultipliers[sg.targetScreenId] ?? 1;
      this.data.screenGates[sgp.id] = sgp;
      this.data.screenGateByLinkId[sg.linkId] = sgp;
      if (sg.exitKey) this.data.screenGateByExitKey[sg.exitKey] = sgp;
    }

    this.data.arrivals = [];
    this.data.arrivalByKey = {};
    for (const a of Object.values(arrivals)) {
      const ap = new ArrivalPreview(a.lineId, a.endpoint, a.id, a.demands, a.screenId, a.queueSide);
      this.data.arrivals.push(ap);
      this.data.arrivalByKey[`${a.lineId}::${a.endpoint}`] = ap;
    }

    this.data.starts = [];
    this.data.tokens = [];
    for (const s of Object.values(starts)) {
      const sp = new StartPreview(s.lineId, s.endpoint, s.delay, s.id, s.screenId, s.firstDelay, [], s.fadeLineAfter);
      this.data.starts.push(sp);
      const line = this.data.lines[s.lineId];
      if (!line) continue;
      const spawnIndex = s.endpoint === "end" ? line.points.length - 1 : 0;
      const direction: 1 | -1 = s.endpoint === "end" ? -1 : 1;
      s.tokens.forEach((tc, i) => {
        const token = new TokenPreview(tc.color as any, tc.speed, tc.id, tc.type as any);
        token.startId = s.id;
        token.lineId = s.lineId;
        token.pointIndex = spawnIndex;
        token.remainder = 0;
        token.direction = direction;
        token.startAt = i === 0 ? s.firstDelay : s.firstDelay + i * s.delay;
        token.currentSpeed = 0;
        if (tc.angled) {
          token.rotationOffset = Math.PI / 4;
          token.targetRotationOffset = Math.PI / 4;
        }
        this.data.tokens.push(token);
      });
    }
  };

  tickSim = (timestamp: number) => {
    if (PROFILING) Profiler.start("tickSim");
    if (this.data.lastTimestamp === null) {
      this.data.lastTimestamp = timestamp;
      return;
    }
    const deltaMs = Math.max(1, Math.min(timestamp - this.data.lastTimestamp, 100));
    this.data.lastTimestamp = timestamp;
    this.data.fps = smoothFps(this.data.fps, deltaMs);

    const deltaSeconds = deltaMs / 1000;
    this.data.elapsedSeconds += deltaSeconds;

    for (const sw of Object.values(this.data.switches)) sw.tick(deltaSeconds);
    for (const cl of Object.values(this.data.cloners)) cl.tick(deltaSeconds);

    for (const start of this.data.starts) {
      const hasWaitingTokens = this.data.tokens.some((t) => t.startId === start.id && this.data.elapsedSeconds < t.startAt);
      const target = hasWaitingTokens ? 1 : 0;
      start.opacity = approach(start.opacity, target, 2, deltaSeconds);

      if (hasWaitingTokens) start.queueEmptyAt = undefined;
      else if (start.queueEmptyAt === undefined) start.queueEmptyAt = this.data.elapsedSeconds;

      const lineTarget = start.fadeLineAfter > 0 && start.queueEmptyAt !== undefined
        && this.data.elapsedSeconds >= start.queueEmptyAt + start.fadeLineAfter ? 0 : 1;
      start.lineOpacity = approach(start.lineOpacity, lineTarget, 2, deltaSeconds);
    }

    for (const arrival of this.data.arrivals) {
      if (arrival.flashProgress < 1) {
        arrival.flashProgress = Math.min(1, arrival.flashProgress + deltaSeconds / 0.35)
      }
      if (arrival.arcFill < arrival.arcTarget) {
        arrival.arcFill = approach(arrival.arcFill, arrival.arcTarget, 3, deltaSeconds)
      }
      if (arrival.isFading) {
        arrival.fadeAlpha = Math.max(0, arrival.fadeAlpha - deltaSeconds / 2)
        if (arrival.fadeAlpha <= 0) {
          arrival.isFading = false
          arrival.fadeAlpha = 1
          arrival.fadingIndex = -1
        }
      }
      const arrivalDone = arrival.demands.length > 0 && arrival.currentDemandIndex >= arrival.demands.length
      const arrivalTarget = arrivalDone ? 0 : 1
      arrival.opacity = approach(arrival.opacity, arrivalTarget, 2, deltaSeconds)
    }

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue;

      if (token.fadingOpacity) {
        const k = 1 - Math.exp(-deltaSeconds / OPACITY_FADE_TAU);
        token.opacity += (token.pendingOpacity - token.opacity) * k;
        if (Math.abs(token.pendingOpacity - token.opacity) < 0.01) {
          token.opacity = token.pendingOpacity;
          token.fadingOpacity = false;
          if (token.pendingOpacity === 0) token.arrived = true;
        }
      }

      if (token.isTransforming) {
        token.transformProgress = Math.min(1, token.transformProgress + deltaSeconds / PAINT_DURATION);
        const activeTransformer = this.data.transformers[this.data.transformerByLinkId[token.transformingLinkId]];
        if (activeTransformer) {
          activeTransformer.transformProgress = token.transformProgress;
          if (token.transformMode === "color") {
            activeTransformer.currentTokenColor = token.displayColor || (token.color as string);
          }
          if (token.transformMode === "fade") {
            token.opacity = token.opacityFrom + (activeTransformer.amount - token.opacityFrom) * token.transformProgress;
          }
        }
        if (token.transformProgress >= 1) {
          token.isTransforming = false;
          if (token.transformMode === "shape") token.type = token.pendingType as any;
          if (token.transformMode === "fade" && activeTransformer) token.opacity = activeTransformer.amount;
          if (activeTransformer) { activeTransformer.transformProgress = -1; activeTransformer.currentTokenColor = ""; }
          if (token.pendingLineId) {
            token.lineId = token.pendingLineId;
            token.pointIndex = token.pendingPointIndex;
            token.direction = token.pendingDirection;
            token.remainder = token.pendingRemainder;
            token.pendingLineId = "";
          }
        }
      } else {
        if (token.direction === 0 || token.speed === 0) continue;
        const line = this.data.lines[token.lineId];
        if (!line) continue;
        const viewedMult = this.data.screenTimeMultipliers[this.data.previewScreenId] ?? 1;
        const tokenScreenId = line.screenId ?? "main";
        const tokenMult = this.data.screenTimeMultipliers[tokenScreenId] ?? 1;
        const dt = deltaSeconds * (tokenMult / viewedMult);
        const targetSpeed = line.boost !== 0 ? Math.max(1, token.speed + line.boost) : Math.max(1, token.speed);
        const k = ACCEL_TIME > 0 ? 1 - Math.exp(-dt / ACCEL_TIME) : 1;
        token.currentSpeed += (targetSpeed - token.currentSpeed) * k;
        if (line.limitation > 0 && token.type !== "cop") {
          if (token.currentSpeed > line.limitation) {
            if (token.speedingLineId !== line.id) {
              token.speedingLineId = line.id;
              const cop = new TokenPreview("#e53935" as any, token.currentSpeed * 1.1);
              cop.type = "cop";
              cop.lineId = token.lineId;
              cop.pointIndex = Math.max(0, Math.min(line.points.length - 1, token.pointIndex - token.direction * 20));
              cop.direction = token.direction;
              cop.remainder = token.remainder;
              cop.currentSpeed = token.currentSpeed * 1.1;
              cop.startAt = this.data.elapsedSeconds + 1.5;
              this.data.tokens.push(cop);
            }
          } else {
            token.speedingLineId = "";
          }
        }
        const result = token.advance(dt, line.points.length);
        if (result) {
          token.speed = token.currentSpeed;
          token.speedingLineId = "";
          const { isInverted, isGrayscale, isDark } = token.transition(result.hit, result.excess, this.data);
          this.data.isInverted = isInverted;
          this.data.isGrayscale = isGrayscale;
          this.data.isDark = isDark;
        }

        if (token.rotationOffset !== token.targetRotationOffset) {
          const diff = token.targetRotationOffset - token.rotationOffset;
          const step = ROTATION_SPEED * deltaSeconds;
          token.rotationOffset = Math.abs(diff) <= step ? token.targetRotationOffset : token.rotationOffset + Math.sign(diff) * step;
        }
      }

      if (token.colorProgress < 1) {
        token.colorProgress = Math.min(1, token.colorProgress + deltaSeconds / PAINT_DURATION);
        token.displayColor = token.colorProgress >= 1 ? "" : lerpHex(token.colorTransitionFrom, token.color as string, token.colorProgress);
      }
    }
    if (this.data.tokens.some(t => t.arrived)) {
      this.data.tokens = this.data.tokens.filter(t => !t.arrived);
    }

    const active = this.data.tokens.filter(
      t => this.data.elapsedSeconds >= t.startAt && t.direction !== 0 && t.opacity >= 1
    );
    for (let i = 0; i < active.length; i++) {
      const lineA = this.data.lines[active[i].lineId];
      const pa = lineA?.points[active[i].pointIndex];
      if (!pa) continue;
      for (let j = i + 1; j < active.length; j++) {
        const lineB = this.data.lines[active[j].lineId];
        if ((lineA?.screenId ?? "main") !== (lineB?.screenId ?? "main")) continue;
        const pb = lineB?.points[active[j].pointIndex];
        if (!pb) continue;
        if (distanceSq(pa, pb) < 16 * 16) {
          this.data.events.push({
            type: "collision", t: this.data.elapsedSeconds,
            colors: [active[i].displayColor || (active[i].color as string), active[j].displayColor || (active[j].color as string)],
          });
          active[i].exploding = true; active[i].direction = 0; active[i].explosionSeed = (Math.random() * 999999) | 0;
          active[j].exploding = true; active[j].direction = 0; active[j].explosionSeed = (Math.random() * 999999) | 0;
        }
      }
    }
    const FADE_DURATION = 8;
    for (const t of this.data.tokens) {
      if (!t.exploding) continue;
      if (t.explosionProgress < 1) {
        t.explosionProgress = Math.min(t.explosionProgress + deltaSeconds / EXPLOSION_DURATION, 1);
      } else {
        t.explosionFadeProgress = Math.min(t.explosionFadeProgress + deltaSeconds / FADE_DURATION, 1);
      }
    }
    this.data.tokens = this.data.tokens.filter(t => !t.exploding || t.explosionFadeProgress < 1);
    if (PROFILING) Profiler.end("tickSim");
  };

  drawAllPreview = (ctx: Renderer) => {
    if (PROFILING) Profiler.start("clearBackground");
    this.clearBackground(ctx);
    if (PROFILING) Profiler.end("clearBackground");

    const sid = this.data.previewScreenId;
    const visibleLines = Object.values(this.data.lines)
      .filter((l) => l.screenId === sid)
      .sort((a, b) => (a.color ? 0 : 1) - (b.color ? 0 : 1));

    if (PROFILING) Profiler.start("drawLinesBefore");
    this.drawLinesBefore(ctx, visibleLines);
    if (PROFILING) Profiler.end("drawLinesBefore");

    if (PROFILING) Profiler.start("drawSwitchesBefore");
    this.drawSwitchesBefore(ctx, sid);
    if (PROFILING) Profiler.end("drawSwitchesBefore");

    if (PROFILING) Profiler.start("drawClonersBefore");
    this.drawClonersBefore(ctx, sid);
    if (PROFILING) Profiler.end("drawClonersBefore");

    if (PROFILING) Profiler.start("drawSwitchLinks");
    this.drawSwitchLinks(ctx);
    if (PROFILING) Profiler.end("drawSwitchLinks");

    if (PROFILING) Profiler.start("drawScreenGateMarkers");
    this.drawScreenGateMarkers(ctx, sid);
    if (PROFILING) Profiler.end("drawScreenGateMarkers");

    if (PROFILING) Profiler.start("drawTransformers");
    this.drawTransformers(ctx, sid);
    if (PROFILING) Profiler.end("drawTransformers");

    if (PROFILING) Profiler.start("drawArrival");
    this.drawArrival(ctx, sid);
    if (PROFILING) Profiler.end("drawArrival");

    if (PROFILING) Profiler.start("drawStartNode");
    this.drawStartNode(ctx, sid);
    if (PROFILING) Profiler.end("drawStartNode");

    if (PROFILING) Profiler.start("drawLinesAfter");
    this.drawLinesAfter(ctx, visibleLines);
    if (PROFILING) Profiler.end("drawLinesAfter");

    if (PROFILING) Profiler.start("drawSwitchesAfter");
    this.drawSwitchesAfter(ctx, sid);
    if (PROFILING) Profiler.end("drawSwitchesAfter");

    if (PROFILING) Profiler.start("drawClonersAfter");
    this.drawClonersAfter(ctx, sid);
    if (PROFILING) Profiler.end("drawClonersAfter");

    if (PROFILING) Profiler.start("drawTokens");
    this.drawTokens(ctx, sid);
    if (PROFILING) Profiler.end("drawTokens");

    if (PROFILING) Profiler.start("drawTransformersAfter");
    this.drawTransformersAfter(ctx, sid);
    if (PROFILING) Profiler.end("drawTransformersAfter");

    if (PROFILING) Profiler.start("drawStartAfter");
    this.drawStartAfter(ctx);
    if (PROFILING) Profiler.end("drawStartAfter");

    if (PROFILING) Profiler.start("drawArrivalAfter");
    this.drawArrivalAfter(ctx, sid);
    if (PROFILING) Profiler.end("drawArrivalAfter");

    if (PROFILING) Profiler.start("drawScreenGates");
    this.drawScreenGates(ctx, sid);
    if (PROFILING) Profiler.end("drawScreenGates");

    if (PROFILING) Profiler.start("drawInverters");
    this.drawInverters(ctx, sid);
    if (PROFILING) Profiler.end("drawInverters");

    if (PROFILING) Profiler.start("drawMiniMap");
    this.drawMiniMap(ctx);
    if (PROFILING) Profiler.end("drawMiniMap");

    if (PROFILING) Profiler.start("drawHudStats");
    this.drawHudStats(ctx);
    if (PROFILING) Profiler.end("drawHudStats");
  };

  clearBackground = (ctx: Renderer) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  };

  // Opacité à appliquer à une ligne : celle du start qui la revendique via `fadeLineAfter`,
  // sinon pleinement visible. Un seul start référence en pratique une ligne donnée.
  private lineFadeOpacity = (lineId: string): number => {
    const s = this.data.starts.find((st) => st.fadeLineAfter > 0 && st.lineId === lineId);
    return s ? s.lineOpacity : 1;
  };

  drawLinesBefore = (ctx: Renderer, visibleLines: LinePreview[]) => {
    for (const line of visibleLines) {
      const alpha = this.lineFadeOpacity(line.id);
      ctx.save();
      ctx.globalAlpha = alpha;
      line.drawBefore(ctx, this.data.elapsedSeconds);
      ctx.restore();
    }
  };

  drawSwitchesBefore = (ctx: Renderer, sid: string) => {
    for (const sw of Object.values(this.data.switches)) {
      sw.prepareFrame(this.data.lines, this.data.links, this.data.linkMap);
      const link = this.data.links[sw.linkIds[0]];
      if (!link) continue;
      if (this.data.lines[link.line1.lineId]?.screenId !== sid) continue;
      sw.drawBefore(ctx);
    }
  };

  drawClonersBefore = (ctx: Renderer, sid: string) => {
    for (const cl of Object.values(this.data.cloners)) {
      cl.prepareFrame(this.data.lines, this.data.links);
      const link = this.data.links[cl.linkIds[0]];
      if (!link) continue;
      if (this.data.lines[link.line1.lineId]?.screenId !== sid) continue;
      cl.drawBefore(ctx);
    }
  };

  drawClonersAfter = (ctx: Renderer, sid: string) => {
    for (const cl of Object.values(this.data.cloners)) {
      const link = this.data.links[cl.linkIds[0]];
      if (!link) continue;
      if (this.data.lines[link.line1.lineId]?.screenId !== sid) continue;
      cl.drawAfter(ctx);
    }
  };

  drawScreenGateMarkers = (ctx: Renderer, sid: string) => {
    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.targetScreenId !== sid) continue;
      if (sg.entryKey) {
        const [eLineId, eEp] = sg.entryKey.split("::");
        const eLine = this.data.lines[eLineId];
        if (eLine) sg.drawEntry(ctx, eEp === "end" ? eLine.end : eLine.start);
      }
      if (sg.exitKey) {
        const [xLineId, xEp] = sg.exitKey.split("::");
        const xLine = this.data.lines[xLineId];
        if (xLine) sg.drawExit(ctx, xEp === "end" ? xLine.end : xLine.start);
      }
    }
  };

  drawTransformers = (ctx: Renderer, sid: string) => {
    for (const tr of Object.values(this.data.transformers)) {
      const link = this.data.links[tr.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.screenId !== sid) continue;
      const isEnd = link.line1.endpoint === "end";
      const pt = isEnd ? line.end : line.start;
      const ptAngle = isEnd ? line.points[line.points.length - 1] : line.points[0];
      tr.drawBefore(ctx, pt, ptAngle?.angle ?? 0);
    }
  };

  drawTransformersAfter = (ctx: Renderer, sid: string) => {
    for (const tr of Object.values(this.data.transformers)) {
      const link = this.data.links[tr.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.screenId !== sid) continue;
      const isEnd = link.line1.endpoint === "end";
      const pt = isEnd ? line.end : line.start;
      tr.drawAnimation(ctx, pt, this.data.elapsedSeconds);
    }
  };

  drawArrival = (ctx: Renderer, sid: string) => {
    for (const arrival of this.data.arrivals) {
      const line = this.data.lines[arrival.lineId];
      if (!line || line.screenId !== sid) continue;
      const pt = arrival.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0];
      if (pt) arrival.drawBefore(ctx, pt);
    }
  };

  drawArrivalAfter = (ctx: Renderer, sid: string) => {
    for (const arrival of this.data.arrivals) {
      const line = this.data.lines[arrival.lineId];
      if (!line || line.screenId !== sid) continue;
      arrival.drawAfter(ctx);
    }
  };

  drawStartNode = (ctx: Renderer, sid: string) => {
    for (const start of this.data.starts) {
      const line = this.data.lines[start.lineId];
      if (!line || line.screenId !== sid) continue;
      const pt = start.endpoint === "end" ? line.points[line.points.length - 1] : line.points[0];
      if (!pt) continue;
      const startTokens = this.data.tokens.filter((t) => t.startId === start.id);
      const nextWaiting = startTokens
        .filter((t) => this.data.elapsedSeconds < t.startAt)
        .sort((a, b) => a.startAt - b.startAt)[0];
      const tokenColor = nextWaiting ? (nextWaiting.displayColor || nextWaiting.color as string) : undefined;
      const isFirst = nextWaiting && startTokens.indexOf(nextWaiting) === 0;
      start.prepareFrame(pt, nextWaiting ? nextWaiting.startAt - this.data.elapsedSeconds : 0, tokenColor, isFirst ? start.firstDelay : start.delay);
      if (nextWaiting) nextWaiting.drawBefore(ctx, pt);
    }
  };

  drawLinesAfter = (ctx: Renderer, visibleLines: LinePreview[]) => {
    for (const line of visibleLines) {
      const badges = line.showSpeed
        ? this.data.tokens
            .filter(t => t.lineId === line.id && !t.exploding && t.type !== "cop" && line.points[t.pointIndex])
            .map(t => ({ pt: line.points[t.pointIndex], speed: t.currentSpeed, color: t.displayColor || (t.color as string) }))
        : [];
      ctx.save();
      ctx.globalAlpha = this.lineFadeOpacity(line.id);
      line.drawAfter(ctx, badges);
      ctx.restore();
    }
  };

  drawSwitchesAfter = (ctx: Renderer, sid: string) => {
    for (const sw of Object.values(this.data.switches)) {
      const link = this.data.links[sw.linkIds[0]];
      if (!link) continue;
      if (this.data.lines[link.line1.lineId]?.screenId !== sid) continue;
      sw.drawAfter(ctx);
    }
  };

  drawTokens = (ctx: Renderer, sid: string) => {
    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue;
      const tokenScreenId = this.data.lines[token.lineId]?.screenId ?? "main";
      if (tokenScreenId !== sid) continue;
      const line = this.data.lines[token.lineId];
      if (!line || line.points.length === 0) continue;
      const pt = line.points[token.pointIndex];
      if (!pt) continue;
      if (token.exploding) token.drawExplosion(ctx, pt);
      else token.drawBefore(ctx, pt, line.boost !== 0 ? line.boost : 0, line.points, line.tunnel ? 0 : undefined);
    }
  };

  drawStartAfter = (ctx: Renderer) => {
    for (const start of this.data.starts) start.drawAfter(ctx);
  };

  drawScreenGates = (ctx: Renderer, sid: string) => {
    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.screenId !== sid) continue;
      const link = this.data.links[sg.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      sg.drawAfter(ctx, pt, this.data.tokens, this.data.lines, this.data.elapsedSeconds);
    }
  };

  drawInverters = (ctx: Renderer, sid: string) => {
    for (const inv of Object.values(this.data.inverters)) {
      const link = this.data.links[inv.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line || line.screenId !== sid || line.points.length === 0) continue;
      const isEnd = link.line1.endpoint === "end";
      const pt = isEnd ? line.end : line.start;
      const ptAngle = isEnd ? line.points[line.points.length - 1] : line.points[0];
      if (inv.effect === "invert") inv.active = this.data.isInverted;
      else if (inv.effect === "grayscale") inv.active = this.data.isGrayscale;
      else if (inv.effect === "dark") inv.active = this.data.isDark;
      inv.drawAfter(ctx, pt, ptAngle?.angle ?? 0);
    }
  };

  drawHudStats = (ctx: Renderer) => {
    if (!this.hudStatsEnabled) return;
    const tokensInNetwork = this.data.tokens.filter(
      (t) => this.data.elapsedSeconds >= t.startAt && !t.exploding
    ).length;
    drawStats(ctx, this.data.fps, tokensInNetwork);
  };

  drawSwitchLinks = (ctx: Renderer) => {
    if (Object.keys(this.data.switchLinks).length === 0) return;
    ctx.save();
    ctx.setLineDash([6, 22]);
    ctx.strokeStyle = COLORS.grayLight;
    ctx.lineWidth = STROKE_WIDTHS.switchLinkDash;
    ctx.lineCap = "square";
    const drawn = new Set<string>();
    for (const [swId, linked] of Object.entries(this.data.switchLinks)) {
      for (const otherId of linked) {
        const key = swId < otherId ? `${swId}:${otherId}` : `${otherId}:${swId}`;
        if (drawn.has(key)) continue;
        drawn.add(key);
        const pa = this.data.switches[swId]?.getPoint();
        const pb = this.data.switches[otherId]?.getPoint();
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  private getMiniMapRect = () => {
    const S = 0.1
    const MW = CANVAS_W * S
    const MH = CANVAS_H * S
    const mx = CANVAS_W - MW - 8
    const my = CANVAS_H - MH - 8
    return { S, MW, MH, mx, my }
  }

  drawMiniMap = (ctx: Renderer) => {
    const prevSid = this.data.previewScreenHistory.at(-1)
    if (!prevSid) return

    const { S, MW, MH, mx, my } = this.getMiniMapRect()

    ctx.beginPath()
    ctx.roundRect(mx, my, MW, MH, 4)
    ctx.fillStyle = COLORS.white
    ctx.fill()
    ctx.strokeStyle = COLORS.grayLight
    ctx.lineWidth = STROKE_WIDTHS.lineGlow
    ctx.setLineDash([])
    ctx.stroke()

    for (const token of this.data.tokens) {
      if (this.data.elapsedSeconds < token.startAt) continue
      const line = this.data.lines[token.lineId]
      if (!line || line.screenId !== prevSid) continue
      const pt = line.points[token.pointIndex]
      if (!pt) continue
      token.drawMini(ctx, mx + pt.x * S, my + pt.y * S, token.orientation(pt))
    }
  };

  clickAt = (x: number, y: number) => {
    if (this.data.previewScreenHistory.length > 0) {
      const { MW, MH, mx, my } = this.getMiniMapRect();
      if (x >= mx && x <= mx + MW && y >= my && y <= my + MH) {
        this.data.previewScreenId = this.data.previewScreenHistory.pop() ?? "main";
        return;
      }
    }
    if (this.data.previewScreenId !== "main") {
      for (const sg of Object.values(this.data.screenGates)) {
        if (sg.targetScreenId !== this.data.previewScreenId) continue;
        if (!sg.exitKey) continue;
        const [xLineId, xEp] = sg.exitKey.split("::");
        const xLine = this.data.lines[xLineId];
        if (!xLine) continue;
        const pt = xEp === "end" ? xLine.end : xLine.start;
        if ((x - pt.x) ** 2 + (y - pt.y) ** 2 <= 12 ** 2) {
          this.data.previewScreenId = this.data.previewScreenHistory.pop() ?? "main";
          return;
        }
      }
    }
    for (const sg of Object.values(this.data.screenGates)) {
      if (sg.screenId !== this.data.previewScreenId) continue;
      if (!sg.targetScreenId) continue;
      const link = this.data.links[sg.linkId];
      if (!link) continue;
      const line = this.data.lines[link.line1.lineId];
      if (!line) continue;
      const pt = link.line1.endpoint === "end" ? line.end : line.start;
      if (Math.abs(x - pt.x) <= 18 && Math.abs(y - pt.y) <= 32) {
        this.data.previewScreenHistory.push(this.data.previewScreenId);
        this.data.previewScreenId = sg.targetScreenId;
        return;
      }
    }
    this.cycleSwitchAt(x, y);
  };

  cycleSwitchAt = (x: number, y: number) => {
    for (const sw of Object.values(this.data.switches)) {
      if (!sw.hitTest(x, y)) continue;
      const linked = this.data.switchLinks[sw.id] ?? [];
      const toCycle = [sw, ...linked.map((id) => this.data.switches[id]).filter(Boolean)] as SwitchPreview[];
      for (const s of toCycle) {
        if (s.linkIds.length > 1) {
          s.cycle();
          s.applyToLinkMap(this.data.links, this.data.linkMap);
        }
      }
      return;
    }
  };
}
