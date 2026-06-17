import { useShallow } from "zustand/react/shallow";
import { useStore } from "store/useStore";
import { computeLinks } from "engine/Link";
import * as S from "./UI";

export const LinkTab = () => {
  const lines = useStore(useShallow((s) => s.lines));
  const links = computeLinks(lines);

  return (
    <S.Wrapper>
      {links.length === 0 ? (
        <S.Empty>No links — shared anchors between lines will appear here.</S.Empty>
      ) : (
        <S.LinkList>
          {links.map((link) => (
            <S.LinkItem key={link.id}>
              <S.LinkId>{link.id}</S.LinkId>
              <S.LinkDesc>
                {link.line1.id}[{link.line1.anchor}] — {link.line2.id}[{link.line2.anchor}]
              </S.LinkDesc>
            </S.LinkItem>
          ))}
        </S.LinkList>
      )}
    </S.Wrapper>
  );
};
