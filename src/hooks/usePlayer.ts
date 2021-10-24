import React from "react";
import { STAGE_WIDTH } from "../setup";
import { randomTetromino } from "../gameHelpers";

// interface 써도 됨
export type Player = {
  pos: {
    x: number;
    y: number;
  };
  // tetromino: (string | number)[][];
  tetromino: (string | number)[][];
  collided: boolean;
};

export const usePlayer = () => {
  const [player, setPlayer] = React.useState({} as Player);

  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }): void => {
    setPlayer((prev) => ({
      ...prev,
      pos: {
        x: prev.pos.x + x,
        y: prev.pos.x + y,
      },
      collided,
    }));
  };

  // stage hook에 사용될 함수 -> 매번 재생성되면 무한루프 돌게 됨 -> 최적화 필요
  const resetPlayer = React.useCallback(
    (): void =>
      setPlayer({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: randomTetromino().shape,
        collided: false,
      }),
    []
  );

  return { player, updatePlayerPos, resetPlayer };
};
