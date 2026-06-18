import { useEffect, useRef } from "react";
import type { Manager } from "engine/Manager";
import { FPS } from "engine/constants";

export const useCanvasDrawPreview = (manager: Manager, isPreview: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPreview) {
      manager.resetSim();
      return;
    }
    manager.initSim();
    const id = setInterval(() => manager.tickSim(), 1000 / FPS);
    return () => clearInterval(id);
  }, [isPreview, manager]);

  useEffect(() => {
    if (!isPreview) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let rafId: number;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        manager.drawAllPreview(ctx);
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [isPreview, manager]);

  return canvasRef;
};
