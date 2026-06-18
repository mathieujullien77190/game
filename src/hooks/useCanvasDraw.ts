import { useEffect, useRef, useCallback } from "react";
import type { EditorManager } from "engine/Manager";
import type { Point } from "engine/types";
import { drawGrid } from "engine/grid";
import { LineEditor } from "engine/Line";

export const useCanvasDraw = (
  manager: EditorManager,
  pendingStart: Point | null,
  pendingEnd: Point | null,
  hoveredPoint: Point | null,
  showGrid: boolean,
  hoveredLineId: string | null,
  hoveredStartId: string | null,
  hoveredArrivalId: string | null,
  hoveredLinkId: string | null,
  hoveredSwitchId: string | null,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showGrid) drawGrid(ctx, canvas.width, canvas.height);

    manager.drawAll(ctx, hoveredLineId ?? undefined, hoveredStartId ?? undefined, hoveredArrivalId ?? undefined, hoveredLinkId ?? undefined, hoveredSwitchId ?? undefined);

    if (pendingStart && pendingEnd && hoveredPoint) {
      LineEditor.drawCurvePreview(ctx, pendingStart, pendingEnd, hoveredPoint);
      LineEditor.drawPendingEnd(ctx, pendingEnd);
    } else if (pendingStart && hoveredPoint) {
      LineEditor.drawPreview(ctx, pendingStart, hoveredPoint);
    }

    if (hoveredPoint) LineEditor.drawHoverPoint(ctx, hoveredPoint);
    if (pendingStart) LineEditor.drawPendingStart(ctx, pendingStart);
  }, [manager, pendingStart, pendingEnd, hoveredPoint, showGrid, hoveredLineId, hoveredStartId, hoveredArrivalId, hoveredLinkId, hoveredSwitchId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return canvasRef;
};
