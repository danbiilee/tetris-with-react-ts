import React from "react"; // 17버전 이후 리액트 임포트 안해도 된다고?
import { StyledCell } from "./Cell.styles";
import { TETROMINOS } from "../../setup";

type Props = {
  type: keyof typeof TETROMINOS;
};

const Cell: React.FC<Props> = ({ type }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
);

export default React.memo(Cell);
