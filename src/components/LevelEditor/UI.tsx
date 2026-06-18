import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  height: 100%;
  background: #f0f2f5;
  user-select: none;
`;

export const CanvasPanel = styled.div<{ $width: number | null }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: ${({ $width }) => ($width !== null ? `${$width}px` : "auto")};
  min-width: 200px;
  padding: 24px;
  overflow: hidden;
`;

export const ResizeDivider = styled.div`
  width: 5px;
  flex-shrink: 0;
  background: #d0d4dc;
  cursor: col-resize;
  transition: background 0.15s;

  &:hover { background: #2563eb; }
  &:active { background: #2563eb; }
`;

export const CanvasWrapper = styled.div`
  position: relative;
  height: 70vh;
  width: calc(70vh * 9 / 16);
`;

const BaseCanvas = styled.canvas<{ $visible: boolean }>`
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 2px solid #c0c6d4;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  z-index: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
`;

export const GameCanvas = styled(BaseCanvas)<{ $addingLine: boolean }>`
  cursor: ${({ $addingLine }) => ($addingLine ? "crosshair" : "default")};
`;

export const PreviewCanvas = styled(BaseCanvas)``;

export const HintOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 14px;
  background: rgba(37, 99, 235, 0.88);
  color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  white-space: nowrap;
  pointer-events: none;
  z-index: 2;
`;

export const OverlayButtons = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
`;

const OverlayButton = styled.button`
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #d0d4dc;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  color: #374151;
  cursor: pointer;

  &:hover { background: #f0f2f5; }
`;

export const GridButton = styled(OverlayButton)``;

export const RestartButton = styled(OverlayButton)`
  background: rgba(239, 68, 68, 0.12);
  border-color: #ef4444;
  color: #ef4444;
  &:hover { background: rgba(239, 68, 68, 0.22); }
`;

export const ViewToggle = styled(OverlayButton)<{ $preview: boolean }>`
  background: ${({ $preview }) =>
    $preview ? "rgba(17, 24, 39, 0.88)" : "rgba(255, 255, 255, 0.92)"};
  color: ${({ $preview }) => ($preview ? "#ffffff" : "#374151")};
  border-color: ${({ $preview }) => ($preview ? "#111827" : "#d0d4dc")};

  &:hover {
    background: ${({ $preview }) =>
      $preview ? "rgba(17, 24, 39, 0.72)" : "#f0f2f5"};
  }
`;
