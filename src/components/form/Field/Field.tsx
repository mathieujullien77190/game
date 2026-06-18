import type { ReactNode } from "react";
import * as S from "./UI";

type Props = { label: string; children: ReactNode };

export const Field = ({ label, children }: Props) => (
  <S.Wrapper>
    <S.Label>{label}</S.Label>
    {children}
  </S.Wrapper>
);
