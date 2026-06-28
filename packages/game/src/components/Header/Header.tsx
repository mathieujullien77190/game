import { IoIosArrowBack } from "react-icons/io"
import type { Props } from "./types"
import * as S from "./UI"

export const Header = ({ title, onBack, right }: Props) => (
  <S.Wrap>
    <S.BackBtn onClick={onBack}>
      <IoIosArrowBack size={22} />
    </S.BackBtn>
    <S.Title>{title}</S.Title>
    {right ?? <S.Spacer />}
  </S.Wrap>
)
