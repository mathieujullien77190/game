import { useState, useRef, useMemo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { useCanvasDraw } from "hooks/useCanvasDraw";
import { useCanvasDrawPreview } from "hooks/useCanvasDrawPreview";
import { snapToGrid } from "engine/grid";
import { Manager } from "engine/Manager";
import { computeLinks } from "engine/Link";
import type { Point } from "engine/types";
import ToolsPanel from "components/ToolsPanel";
import type { Drag } from "./types";
import { dist, getHint } from "./helpers";
import * as S from "./UI";

export const LevelEditor = () => {
  const {
    lines,
    starts,
    arrivals,
    switches,
    balls,
    mode,
    pendingStart,
    pendingEnd,
    showGrid,
    hoveredLineId,
    hoveredStartId,
    hoveredArrivalId,
    hoveredLinkId,
    hoveredSwitchId,
    linkActive,
    addLine,
    addStart,
    addArrival,
    addSwitch,
    setPendingStart,
    setPendingEnd,
    setMode,
    toggleGrid,
    updateLineAnchor,
    updateLineControl,
  } = useStore(
    useShallow((s) => ({
      lines: s.lines,
      starts: s.starts,
      arrivals: s.arrivals,
      switches: s.switches,
      balls: s.balls,
      mode: s.mode,
      pendingStart: s.pendingStart,
      pendingEnd: s.pendingEnd,
      showGrid: s.showGrid,
      hoveredLineId: s.hoveredLineId,
      hoveredStartId: s.hoveredStartId,
      hoveredArrivalId: s.hoveredArrivalId,
      hoveredLinkId: s.hoveredLinkId,
      hoveredSwitchId: s.hoveredSwitchId,
      linkActive: s.linkActive,
      setLinkActives: s.setLinkActives,
      addLine: s.addLine,
      addStart: s.addStart,
      addArrival: s.addArrival,
      addSwitch: s.addSwitch,
      setPendingStart: s.setPendingStart,
      setPendingEnd: s.setPendingEnd,
      setMode: s.setMode,
      toggleGrid: s.toggleGrid,
      updateLineAnchor: s.updateLineAnchor,
      updateLineControl: s.updateLineControl,
    })),
  );

  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [leftWidth, setLeftWidth] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const dragRef = useRef<Drag | null>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const manager = useMemo(
    () =>
      new Manager({
        lines: lines.map((l) => ({
          id: l.id,
          type: l.type,
          start: l.start,
          end: l.end,
          control: l.control,
        })),
        links: computeLinks(lines, linkActive).map((lk) => ({
          id: lk.id,
          active: lk.active,
          line1: lk.line1,
          line2: lk.line2,
        })),
        starts: starts.map((s) => ({
          id: s.id,
          position: s.position,
          delay: s.delay,
        })),
        arrivals: arrivals.map((a) => ({ id: a.id, position: a.position })),
        switches: switches.map((sw) => ({
          id: sw.id,
          position: sw.position,
          enter: sw.inputLine,
        })),
        balls: balls.map((b) => ({ id: b.id, color: b.color, speed: b.speed })),
      }),
    [lines, linkActive, starts, arrivals, switches, balls],
  );

  useEffect(() => {
    console.log("manager", manager);
  }, [manager]);

  const editorCanvasRef = useCanvasDraw(
    manager,
    pendingStart,
    pendingEnd,
    hoveredPoint,
    showGrid,
    hoveredLineId,
    hoveredStartId,
    hoveredArrivalId,
    hoveredLinkId,
    hoveredSwitchId,
  );
  const previewCanvasRef = useCanvasDrawPreview(manager, isPreview);

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point | null => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth =
      leftPanelRef.current?.getBoundingClientRect().width ?? 400;

    const onMouseMove = (ev: MouseEvent) => {
      const total = layoutRef.current?.getBoundingClientRect().width ?? 800;
      setLeftWidth(
        Math.max(200, Math.min(total - 200, startWidth + ev.clientX - startX)),
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "idle") return;
    const point = getPoint(e);
    if (!point) return;
    for (let i = 0; i < lines.length; i++) {
      if (dist(point, lines[i].start) < 10) {
        dragRef.current = { lineIndex: i, which: "start" };
        return;
      }
      if (dist(point, lines[i].end) < 10) {
        dragRef.current = { lineIndex: i, which: "end" };
        return;
      }
      const ctrl = lines[i].control;
      if (ctrl && dist(point, ctrl) < 10) {
        dragRef.current = { lineIndex: i, which: "control" };
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPoint(e);
    if (!point) return;
    const snapped = snapToGrid(point);
    setHoveredPoint(snapped);
    if (dragRef.current) {
      const { lineIndex, which } = dragRef.current;
      if (which === "control") {
        updateLineControl(lineIndex, snapped);
      } else {
        updateLineAnchor(lineIndex, which, snapped);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      return;
    }

    const point = getPoint(e);
    if (!point) return;
    const snapped = snapToGrid(point);

    if (mode === "addLine") {
      if (!pendingStart) {
        setPendingStart(snapped);
      } else {
        addLine(pendingStart, snapped);
        setPendingStart(null);
        setMode("idle");
      }
    } else if (mode === "addCurve") {
      if (!pendingStart) {
        setPendingStart(snapped);
      } else if (!pendingEnd) {
        setPendingEnd(snapped);
      } else {
        addLine(pendingStart, pendingEnd, snapped);
        setPendingStart(null);
        setPendingEnd(null);
        setMode("idle");
      }
    } else if (mode === "addStart") {
      for (const line of lines) {
        if (dist(point, line.start) < 15) {
          addStart({ id: line.id, anchor: "start" });
          setMode("idle");
          return;
        }
        if (dist(point, line.end) < 15) {
          addStart({ id: line.id, anchor: "end" });
          setMode("idle");
          return;
        }
      }
    } else if (mode === "addArrival") {
      for (const line of lines) {
        if (dist(point, line.start) < 15) {
          addArrival({ id: line.id, anchor: "start" });
          setMode("idle");
          return;
        }
        if (dist(point, line.end) < 15) {
          addArrival({ id: line.id, anchor: "end" });
          setMode("idle");
          return;
        }
      }
    } else if (mode === "addSwitch") {
      for (const line of lines) {
        if (dist(point, line.start) < 15) {
          addSwitch({ id: line.id, anchor: "start" });
          setMode("idle");
          return;
        }
        if (dist(point, line.end) < 15) {
          addSwitch({ id: line.id, anchor: "end" });
          setMode("idle");
          return;
        }
      }
    }
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    for (const [switchId, sw] of Object.entries(manager.switches)) {
      const line = manager.lines[sw.position.id];
      if (!line) continue;
      const swPoint = sw.position.anchor === "start" ? line.start : line.end;
      if (dist(point, swPoint) < 15) {
        manager.cycleSwitch(switchId);
        break;
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    dragRef.current = null;
  };

  const hint = getHint(mode, pendingStart, pendingEnd);

  return (
    <S.Layout ref={layoutRef}>
      <S.CanvasPanel ref={leftPanelRef} $width={leftWidth}>
        <S.CanvasWrapper>
          <S.GameCanvas
            ref={editorCanvasRef}
            $visible={!isPreview}
            $addingLine={mode !== "idle"}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
          <S.PreviewCanvas
            ref={previewCanvasRef}
            $visible={isPreview}
            onMouseUp={handlePreviewClick}
          />
          {hint && !isPreview && <S.HintOverlay>{hint}</S.HintOverlay>}
          <S.OverlayButtons>
            {!isPreview && (
              <S.GridButton onClick={toggleGrid}>
                {showGrid ? "Hide grid" : "Show grid"}
              </S.GridButton>
            )}
            {isPreview && (
              <S.RestartButton
                onClick={() => {
                  manager.resetSim();
                  manager.initSim();
                }}
              >
                Restart
              </S.RestartButton>
            )}
            <S.ViewToggle
              $preview={isPreview}
              onClick={() => setIsPreview((v) => !v)}
            >
              {isPreview ? "Editor" : "Preview"}
            </S.ViewToggle>
          </S.OverlayButtons>
        </S.CanvasWrapper>
      </S.CanvasPanel>
      <S.ResizeDivider onMouseDown={handleDividerMouseDown} />
      <ToolsPanel />
    </S.Layout>
  );
};
