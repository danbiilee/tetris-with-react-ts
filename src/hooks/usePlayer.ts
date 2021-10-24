import { isColliding } from "./../gameHelpers";
import { STAGE } from "./../components/Stage/Stage";
import React, { cloneElement } from "react";
import { STAGE_WIDTH } from "../setup";
import { randomTetromino } from "../gameHelpers";

// interface 써도 됨
export type Player = {
  pos: {
    x: number;
    y: number;
  };
  tetromino: (string | number)[][];
  collided: boolean;
};

export const usePlayer = () => {
  const [player, setPlayer] = React.useState({} as Player);

  const rotate = (matrix: Player["tetromino"]) => {
    // Make the rows to become cols (transpose)
    const mtrx = matrix.map((_, i) => matrix.map((column) => column[i]));

    // Reverse each row to get a rotated matrix
    return mtrx.map((row) => row.reverse());
  };

  const playerRotate = (stage: STAGE): void => {
    const clonedPlayer = JSON.parse(JSON.stringify(player)); // deep clone
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);

    // This one is so the player can't rotate into the walls or other tetrominos that's merged
    const posX = clonedPlayer.pos.x;
    let offset = 1;
    while (isColliding(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > clonedPlayer.tetromino[0].length) {
        clonedPlayer.pos.x = posX;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

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
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
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

  return { player, updatePlayerPos, resetPlayer, playerRotate };
};
