import type { MouseEvent } from "react"
import { CANVAS_W, CANVAS_H } from "engine/constants"
import type { EditorManager } from "engine/Manager/EditorManager"
import type { StartEditor } from "engine/Start/StartEditor"
import type { SwitchEditor } from "engine/Switch/SwitchEditor"
import type { TransformerEditor } from "engine/Transformer/TransformerEditor"
import { TRANSFORMER_COLORS } from "engine/Transformer/TransformerEditor"
import type { InverterEditor } from "engine/Inverter/InverterEditor"
import type { ArrivalEditor } from "engine/Arrival/ArrivalEditor"
import type { ScreenGateEditor } from "engine/ScreenGate/ScreenGateEditor"
import type { TransformerType } from "engine/Transformer/Transformer"
import type { Point } from "engine/types"
import { SvgGrid } from "./SvgGrid"
import { SvgPendingLine } from "./SvgPendingLine"

type Props = {
  editorManager: EditorManager
  hoveredLineId: string | null
  snapPoint: Point | null
  pendingPoint: Point | null
  showIds: boolean
  starts: StartEditor[]
  switches: SwitchEditor[]
  previewStartPt: Point | null
  previewSwitchPt: Point | null
  hoveredSwitchId: string | null
  transformers: TransformerEditor[]
  hoveredTransformerId: string | null
  previewTransformerPt: Point | null
  previewTransformerType: TransformerType | null
  inverters: InverterEditor[]
  hoveredInverterId: string | null
  previewInverterPt: Point | null
  arrival: ArrivalEditor | null
  previewArrivalPt: Point | null
  screenGates: ScreenGateEditor[]
  hoveredScreenGateId: string | null
  previewScreenGatePt: Point | null
  screenGateMarkers: { entryKey: string; exitKey: string }[]
  visibleLineIds?: Set<string>
  cursor: string
  visible: boolean
  onMouseDown: (e: MouseEvent<SVGSVGElement>) => void
  onMouseMove: (e: MouseEvent<SVGSVGElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onClick: (e: MouseEvent<SVGSVGElement>) => void
}

export const SvgEditorCanvas = ({
  editorManager,
  hoveredLineId,
  snapPoint,
  pendingPoint,
  showIds,
  starts,
  switches,
  previewStartPt,
  previewSwitchPt,
  hoveredSwitchId,
  transformers,
  hoveredTransformerId,
  previewTransformerPt,
  previewTransformerType,
  inverters,
  hoveredInverterId,
  previewInverterPt,
  arrival,
  previewArrivalPt,
  screenGates,
  hoveredScreenGateId,
  previewScreenGatePt,
  screenGateMarkers,
  visibleLineIds,
  cursor,
  visible,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
}: Props) => {
  if (!visible) return null

  const { lines, links } = editorManager.data

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      shapeRendering="geometricPrecision"
      style={{ display: "block", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#fff", cursor, userSelect: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <SvgGrid/>

      {/* Switches */}
      {switches.map((sw) => sw.render(links, lines, sw.id === hoveredSwitchId))}
      {previewSwitchPt && (
        <circle cx={previewSwitchPt.x} cy={previewSwitchPt.y} r={18} fill="#7c3aed" opacity={0.45}/>
      )}

      {/* Inverters */}
      {inverters.map((inv) => inv.render(links, lines, inv.id === hoveredInverterId))}
      {previewInverterPt && (
        <line
          x1={previewInverterPt.x - 14} y1={previewInverterPt.y}
          x2={previewInverterPt.x + 14} y2={previewInverterPt.y}
          stroke="#7b1fa2" strokeWidth={3} strokeLinecap="round" opacity={0.45}
        />
      )}

      {/* Transformers */}
      {transformers.map((tr) => tr.render(links, lines, tr.id === hoveredTransformerId))}
      {previewTransformerPt && (
        <circle
          cx={previewTransformerPt.x} cy={previewTransformerPt.y} r={18}
          fill={TRANSFORMER_COLORS[previewTransformerType ?? ""] ?? "#888"}
          opacity={0.45}
        />
      )}

      {/* Lines */}
      {Object.values(lines).map((line) => {
        if (visibleLineIds && !visibleLineIds.has(line.id)) return null
        return line.render(line.id === hoveredLineId, showIds)
      })}

      {/* Screen gate entry/exit markers */}
      {screenGateMarkers.flatMap(({ entryKey, exitKey }, i) => {
        const nodes = []
        if (entryKey) {
          const [eLineId, eEp] = entryKey.split("::")
          const eLine = lines[eLineId]
          if (eLine) {
            const pt = eEp === "end" ? eLine.end : eLine.start
            nodes.push(<circle key={`entry-${i}`} cx={pt.x} cy={pt.y} r={4} fill="#000"/>)
          }
        }
        if (exitKey) {
          const [xLineId, xEp] = exitKey.split("::")
          const xLine = lines[xLineId]
          if (xLine) {
            const pt = xEp === "end" ? xLine.end : xLine.start
            nodes.push(
              <g key={`exit-${i}`}>
                <circle cx={pt.x} cy={pt.y} r={8} fill="none" stroke="#000" strokeWidth={2}/>
                <circle cx={pt.x} cy={pt.y} r={4} fill="#000"/>
              </g>
            )
          }
        }
        return nodes
      })}

      {/* Starts */}
      {starts.map((s) => s.render(lines))}
      {previewStartPt && (
        <g opacity={0.45}>
          <circle cx={previewStartPt.x} cy={previewStartPt.y} r={14} fill="#000"/>
          <polygon
            points={`${previewStartPt.x - 4},${previewStartPt.y - 6} ${previewStartPt.x + 8},${previewStartPt.y} ${previewStartPt.x - 4},${previewStartPt.y + 6}`}
            fill="#fff"
          />
        </g>
      )}

      {/* Arrival */}
      {arrival && arrival.render(lines)}
      {previewArrivalPt && (
        <g opacity={0.45}>
          <circle cx={previewArrivalPt.x} cy={previewArrivalPt.y} r={14} fill="#000"/>
          <rect x={previewArrivalPt.x - 5} y={previewArrivalPt.y - 5} width={10} height={10} fill="#fff"/>
        </g>
      )}

      {/* Screen gates */}
      {screenGates.map((sg) => sg.render(links, lines, sg.id === hoveredScreenGateId))}
      {previewScreenGatePt && (
        <rect
          x={previewScreenGatePt.x - 18} y={previewScreenGatePt.y - 32}
          width={36} height={64} rx={5}
          fill="#fff" stroke="#000" strokeWidth={2} opacity={0.45}
        />
      )}

      <SvgPendingLine pendingPoint={pendingPoint} snapPoint={snapPoint}/>

    </svg>
  )
}
