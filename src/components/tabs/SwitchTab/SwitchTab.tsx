import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { computeLinks } from "engine/Link";
import type { Switch } from "engine/Switch";
import type { Link } from "engine/Link";
import type Line from "engine/Line";
import type { LineRef } from "engine/types";
import ItemRow from "components/ItemRow";
import Button from "components/ui/Button";
import { Tag } from "components/ui/Tag";
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

const getLinksForInput = (links: Link[], inputLine: LineRef): Link[] =>
  links.filter(
    (lk) =>
      (lk.line1.id === inputLine.id && lk.line1.anchor === inputLine.anchor) ||
      (lk.line2.id === inputLine.id && lk.line2.anchor === inputLine.anchor),
  );

const refKey = (ref: LineRef) => `${ref.id}::${ref.anchor}`;

const getUniqueRefsAtPoint = (links: Link[], currentInput: LineRef): LineRef[] => {
  const seen = new Set<string>();
  const refs: LineRef[] = [];
  const addRef = (ref: LineRef) => {
    const k = refKey(ref);
    if (!seen.has(k)) { seen.add(k); refs.push(ref); }
  };
  for (const lk of links) {
    addRef(lk.line1);
    addRef(lk.line2);
  }
  addRef(currentInput);
  return refs;
};

export const SwitchTab = () => {
  const {
    switches,
    lines,
    linkActive,
    mode,
    setMode,
    removeSwitch,
    setSwitchInput,
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
      setSwitchInput: s.setSwitchInput,
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
          const possibleInputs = getUniqueRefsAtPoint(allAtPoint, sw.input);
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
                  <Tag color="#6366f1" bg="#eef2ff" large>{sw.screenId ?? "mainScreen"}</Tag>
                </S.SwitchHeader>
                <S.Hr />
                <Field label="Entrée">
                  <S.InputLineOptions>
                    {possibleInputs.map((ref) => (
                      <TagLine
                        key={refKey(ref)}
                        lineId={ref.id}
                        anchor={ref.anchor}
                        selected={refKey(ref) === refKey(sw.input)}
                        onClick={() => setSwitchInput(index, ref)}
                      />
                    ))}
                  </S.InputLineOptions>
                </Field>
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
