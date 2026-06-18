import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { computeLinks } from "engine/Link";
import type { Switch } from "engine/Switch";
import type { Link } from "engine/Link";
import type Line from "engine/Line";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { TagLine } from "components/ui/TagLine";
import { TagLink } from "components/ui/TagLink";
import { Field } from "components/form/Field";
import * as S from "./UI";

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
          const allAtPoint = getLinksAtPoint(allLinks, lines, sw.input);
          const displayedLinks = getLinksForInput(allAtPoint, sw.input);

          return (
            <ItemRow
              key={sw.id}
              onDelete={() => removeSwitch(index)}
              onMouseEnter={() => setHoveredSwitchId(sw.id)}
              onMouseLeave={() => setHoveredSwitchId(null)}
            >
              <S.SwitchInfo>
                <S.SwitchHeader>
                  <S.SwitchId>{sw.id}</S.SwitchId>
                  <TagLine lineId={sw.input.id} anchor={sw.input.anchor} selected={false} />
                </S.SwitchHeader>
                <Field label="Links">
                  {displayedLinks.length === 0 && <S.Empty>No links</S.Empty>}
                  {displayedLinks.map((lk) => (
                    <S.LinkOption
                      key={lk.id}
                      $active={lk.active}
                      onClick={() => toggleLinkActive(lk.id)}
                    >
                      <TagLink linkId={lk.id} active={lk.active} />
                    </S.LinkOption>
                  ))}
                </Field>
              </S.SwitchInfo>
            </ItemRow>
          );
        })}
      </S.SwitchList>
    </S.Wrapper>
  );
};
