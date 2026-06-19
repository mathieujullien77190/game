import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { serializeLevel } from "./helpers";
import demoLevel from "levels/demo";
import * as S from "./UI";

export const JsonTab = () => {
  const { lines, starts, arrivals, switches, painters, tokens, linkActive, clearLines, importLevel } = useStore(
    useShallow((s) => ({
      lines: s.lines,
      starts: s.starts,
      arrivals: s.arrivals,
      switches: s.switches,
      painters: s.painters,
      tokens: s.tokens,
      linkActive: s.linkActive,
      clearLines: s.clearLines,
      importLevel: s.importLevel,
    })),
  );

  const json = serializeLevel(lines, starts, arrivals, switches, painters, tokens, linkActive);
  const [localJson, setLocalJson] = useState(json);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setLocalJson(json);
  }, [json, dirty]);

  const handleImport = () => {
    try {
      importLevel(JSON.parse(localJson));
      setDirty(false);
    } catch {
      // invalid JSON — do nothing
    }
  };

  const handleLoadDemo = () => {
    importLevel(demoLevel);
    setDirty(false);
  };

  return (
    <S.Wrapper>
      <S.Textarea
        value={localJson}
        onChange={(e) => { setLocalJson(e.target.value); setDirty(true); }}
        spellCheck={false}
      />
      <S.ButtonRow>
        <S.ActionButton $variant="primary" onClick={handleLoadDemo}>load demo</S.ActionButton>
        {dirty && <S.ActionButton $variant="primary" onClick={handleImport}>apply</S.ActionButton>}
        {dirty && <S.ActionButton $variant="neutral" onClick={() => { setLocalJson(json); setDirty(false); }}>reset</S.ActionButton>}
        <S.ActionButton $variant="danger" onClick={clearLines} style={{ marginLeft: "auto" }}>clear</S.ActionButton>
      </S.ButtonRow>
    </S.Wrapper>
  );
};
