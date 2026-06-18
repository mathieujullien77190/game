import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { computeLinks } from "engine/Link";
import type { Switch } from "engine/Switch";
import type { Link } from "engine/Link";
import type Line from "engine/Line";
import type { LineRef } from "engine/types";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { TagLine } from "components/ui/TagLine";
import { TagLink } from "components/ui/TagLink";
import * as S from "./UI";

const getLineRefsAtPoint = (lines: Line[], position: LineRef): LineRef[] => {
  const posLine = lines.find((l) => l.id === position.id);
  if (!posLine) return [];
  const pt = position.anchor === "start" ? posLine.start : posLine.end;
  const refs: LineRef[] = [];
  for (const line of lines) {
    if (line.start.x === pt.x && line.start.y === pt.y) refs.push({ id: line.id, anchor: "start" });
    if (line.end.x === pt.x && line.end.y === pt.y) refs.push({ id: line.id, anchor: "end" });
  }
  return refs;
};

const getLinksAtPoint = (links: Link[], lines: Line[], position: LineRef): Link[] => {
  const posLine = lines.find((l) => l.id === position.id);
  if (!posLine) return [];
  const pt = position.anchor === "start" ? posLine.start : posLine.end;
  return links.filter((lk) => {
    const l1 = lines.find((l) => l.id === lk.line1.id);
    const l2 = lines.find((l) => l.id === lk.line2.id);
    if (!l1 || !l2) return false;
    const p1 = lk.line1.anchor === "start" ? l1.start : l1.end;
    const p2 = lk.line2.anchor === "start" ? l2.start : l2.end;
    return (p1.x === pt.x && p1.y === pt.y) || (p2.x === pt.x && p2.y === pt.y);
  });
};

const refKey = (ref: LineRef) => `${ref.id}::${ref.anchor}`;

const getLinksForInput = (links: Link[], inputLine: LineRef): Link[] =>
  links.filter(
    (lk) =>
      (lk.line1.id === inputLine.id && lk.line1.anchor === inputLine.anchor) ||
      (lk.line2.id === inputLine.id && lk.line2.anchor === inputLine.anchor),
  );

export const SwitchTab = () => {
  const {
    switches,
    lines,
    linkActive,
    mode,
    setMode,
    removeSwitch,
    setHoveredSwitchId,
    toggleLinkActive,
    setSwitchInputLine,
  } = useStore(
    useShallow((s) => ({
      switches: s.switches,
      lines: s.lines,
      linkActive: s.linkActive,
      mode: s.mode,
      setMode: s.setMode,
      removeSwitch: s.removeSwitch,
      setHoveredSwitchId: s.setHoveredSwitchId,
      toggleLinkActive: s.toggleLinkActive,
      setSwitchInputLine: s.setSwitchInputLine,
    })),
  );

  const allLinks = computeLinks(lines, linkActive);

  return (
    <S.Wrapper>
      <Button
        color={mode === "addSwitch" ? "#ef4444" : "#6b7280"}
        onClick={() => setMode(mode === "addSwitch" ? "idle" : "addSwitch")}
      >
        {mode === "addSwitch" ? "Cancel" : "Add Switch"}
      </Button>
      <S.SwitchList>
        {switches.length === 0 && <S.Empty>No switches</S.Empty>}
        {switches.map((sw: Switch, index) => {
          const lineRefs = getLineRefsAtPoint(lines, sw.position);
          const allAtPoint = getLinksAtPoint(allLinks, lines, sw.position);
          const displayedLinks = sw.inputLine
            ? getLinksForInput(allAtPoint, sw.inputLine)
            : allAtPoint;

          return (
            <ItemRow
              key={sw.id}
              onDelete={() => removeSwitch(index)}
              onMouseEnter={() => setHoveredSwitchId(sw.id)}
              onMouseLeave={() => setHoveredSwitchId(null)}
            >
              <S.SwitchInfo>
                <S.SwitchId>{sw.id}</S.SwitchId>
                <S.InputLineSelector>
                  <S.InputLineLabel>Entrée</S.InputLineLabel>
                  <S.InputLineOptions>
                    {lineRefs.map((ref) => {
                      const isSelected = sw.inputLine !== null && refKey(sw.inputLine) === refKey(ref);
                      return (
                        <TagLine
                          key={refKey(ref)}
                          lineId={ref.id}
                          anchor={ref.anchor}
                          selected={isSelected}
                          onClick={() => setSwitchInputLine(sw.id, isSelected ? null : ref)}
                        />
                      );
                    })}
                  </S.InputLineOptions>
                </S.InputLineSelector>
                {displayedLinks.length === 0 && <S.Empty>No links</S.Empty>}
                {displayedLinks.map((lk) => (
                  <S.LinkOption
                    key={lk.id}
                    $active={lk.active}
                    onClick={() => toggleLinkActive(lk.id)}
                  >
                    <S.LinkDot $active={lk.active} />
                    <TagLink linkId={lk.id} active={lk.active} />
                  </S.LinkOption>
                ))}
              </S.SwitchInfo>
            </ItemRow>
          );
        })}
      </S.SwitchList>
    </S.Wrapper>
  );
};
