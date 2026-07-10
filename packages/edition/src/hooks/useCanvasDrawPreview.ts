import { type RefObject, useEffect } from "react";
import { PreviewManager } from "@drift/engine/Manager/PreviewManager";
import { Profiler } from "@drift/engine/Profiler";
import { Canvas2DRenderer, applyScreenEffects } from "@drift/canvas-render";

Profiler.setClock(() => performance.now());

export const useCanvasDrawPreview = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  manager: PreviewManager | null,
  dpr: number,
  paused: boolean,
) => {
  useEffect(() => {
    if (!manager) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;
    const tick = (timestamp: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const t0 = performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!paused) manager.tickSim(timestamp);
      manager.drawAllPreview(new Canvas2DRenderer(ctx));
      applyScreenEffects(ctx, manager);
      manager.data.frameMs = performance.now() - t0;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [canvasRef, manager, dpr, paused]);
};
