import { useEffect, useRef, useCallback } from "react";
import type { Manager } from "engine/Manager";

export const useCanvasDrawPreview = (manager: Manager) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    manager.drawAllPreview(ctx);
  }, [manager]);

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
