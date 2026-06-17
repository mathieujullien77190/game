import { FaTrash } from "react-icons/fa";
import type { Props } from "./types";
import * as S from "./UI";

export const ItemRow = ({ children, onDelete, onMouseEnter, onMouseLeave }: Props) => (
  <S.Row onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <S.Content>{children}</S.Content>
    <S.DeleteBtn type="button" onClick={onDelete}>
      <FaTrash />
    </S.DeleteBtn>
  </S.Row>
);
