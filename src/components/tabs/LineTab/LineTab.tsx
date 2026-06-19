import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { computeLinks } from "engine/Link";
import { EDITOR_COLORS } from "engine/colors";
import { PALETTE } from "engine/colors";
import ItemRow from "components/ItemRow";
import { Tag } from "components/ui/Tag";
import { TagLine } from "components/ui/TagLine";
import Button from "components/ui/Button";
import { ColorPicker } from "components/form/ColorPicker";
import { buildAnchorMap } from "./helpers";
import * as S from "./UI";

export const LineTab = () => {
  const {
    lines,
    mode,
    linkActive,
    setMode,
    setPendingStart,
    setPendingEnd,
    removeLine,
    setLineColor,
    toggleLinkActive,
  } = useStore(
    useShallow((s) => ({
      lines: s.lines,
      mode: s.mode,
      linkActive: s.linkActive,
      setMode: s.setMode,
      setPendingStart: s.setPendingStart,
      setPendingEnd: s.setPendingEnd,
      removeLine: s.removeLine,
      setLineColor: s.setLineColor,
      toggleLinkActive: s.toggleLinkActive,
    })),
  );

  const isEditing = mode === "addLine" || mode === "addCurve";
  const links = computeLinks(lines, linkActive);
  const anchorMap = buildAnchorMap(links);

  const cancel = () => {
    setMode("idle");
    setPendingStart(null);
    setPendingEnd(null);
  };

  return (
    <S.Wrapper>
      {isEditing ? (
        <Button color="#ef4444" onClick={cancel}>
          Cancel
        </Button>
      ) : (
        <S.ButtonRow>
          <Button color={EDITOR_COLORS.anchorStart} onClick={() => setMode("addLine")}>
            Add Line
          </Button>
          <Button color={EDITOR_COLORS.pointCurve} onClick={() => setMode("addCurve")}>
            Add Curve
          </Button>
        </S.ButtonRow>
      )}
      {lines.length > 0 && (
        <S.LineList>
          {lines.map((line, index) => {
            const connections = anchorMap[line.id] ?? { start: [], end: [] };
            return (
              <ItemRow
                key={line.id}
                onDelete={() => removeLine(index)}
              >
                <S.LineLabel>
                  <S.LineId>
                    <TagLine lineId={line.id} large />
                    <Tag color="#374151" bg="#f3f4f6" large>
                      {line.type}
                    </Tag>
                    <Tag color="#6366f1" bg="#eef2ff" large>{line.screenId ?? "mainScreen"}</Tag>
                  </S.LineId>
                  <S.Hr />
                  <S.Anchors>
                    <S.AnchorGroup>
                      <Tag color={EDITOR_COLORS.anchorStart} bg={EDITOR_COLORS.anchorStartBg}>
                        start
                      </Tag>
                      {connections.start.length > 0 ? (
                        connections.start.map(({ lineId, linkId, active }) => (
                          <TagLine
                            key={linkId}
                            lineId={lineId}
                            active={active}
                            muted
                            onClick={() => toggleLinkActive(linkId)}
                          />
                        ))
                      ) : (
                        <S.Empty>—</S.Empty>
                      )}
                    </S.AnchorGroup>
                    <S.AnchorGroup>
                      <Tag color={EDITOR_COLORS.anchorEnd} bg={EDITOR_COLORS.anchorEndBg}>
                        end
                      </Tag>
                      {connections.end.length > 0 ? (
                        connections.end.map(({ lineId, linkId, active }) => (
                          <TagLine
                            key={linkId}
                            lineId={lineId}
                            active={active}
                            muted
                            onClick={() => toggleLinkActive(linkId)}
                          />
                        ))
                      ) : (
                        <S.Empty>—</S.Empty>
                      )}
                    </S.AnchorGroup>
                  </S.Anchors>
                  <ColorPicker
                    label="color"
                    palette={PALETTE}
                    value={line.color}
                    onChange={(color) => setLineColor(index, color)}
                  />
                </S.LineLabel>
              </ItemRow>
            );
          })}
        </S.LineList>
      )}
    </S.Wrapper>
  );
};
