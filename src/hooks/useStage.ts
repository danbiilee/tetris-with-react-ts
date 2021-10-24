import React from "react";
import { createStage } from "../gameHelpers";
// Types: type을 안붙여도 되지만 확실하게 하기 위해 명시
import type { Player } from "./usePlayer";
// import type { STAGECELL } from "./../components/Stage/Stage";
// import type { STAGE } from "./../components/Stage/Stage";

export type STAGECELL = [string | number, string]; // 위에 걸로 하면 타입 에러남...
export type STAGE = STAGECELL[][];

export const useStage = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = React.useState(createStage());
  const [rowsCleared, setRowsCleared] = React.useState(0);

  React.useEffect(() => {
    if (!player.pos) return;

    setRowsCleared(0);

    const sweepRows = (newStage: STAGE): STAGE => {
      return newStage.reduce((ack, row) => {
        // If we don't find a 0, it means that the row is full and should be cleared
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          // Create an empty row at the beginning of the array to push the Tetrominos down
          // instead of returning the cleared row
          ack.unshift(
            new Array(newStage[0].length).fill([0, "clear"]) as STAGECELL[]
          );
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as STAGE);
    };

    const updateStage = (prevStage: STAGE): STAGE => {
      // First flush the stage
      // If it sasys 'clear' but don't have a 0, it means that it's the players move and should be cleared.
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === "clear" ? [0, "clear"] : cell
          ) as STAGECELL[]
      );

      // Then draw the tetromino
      // 일반 for문이 더 빠르지만 프로그램이 무겁지 않아서 괜찮음
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });

      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player.collided, player.pos?.x, player.pos?.y, player.tetromino]);

  return { stage, setStage, rowsCleared };
};
