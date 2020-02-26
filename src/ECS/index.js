import { filter } from "lodash";
import { pxToCell } from "../lib/canvas";

import appearance from "./components/appearance";
import blocking from "./components/blocking";
import moveTo from "./components/move-to";
import position from "./components/position";

import * as renderSystem from "./systems/render";
import * as movementSystem from "./systems/movement";

const ECS = {
  entities: {},
  components: {
    appearance,
    blocking,
    moveTo,
    position
  },
  systems: [movementSystem, renderSystem],
  game: {
    playerId: null,
    paused: false,
    turn: 0,
    userInput: null,
    playerTurn: true,
    grid: {
      width: 100,
      height: 34,
      map: {
        width: 79,
        height: 29,
        x: 21,
        y: 3
      }
    }
  }
};

const canvas = document.querySelector("#canvas");

canvas.onclick = e => {
  const [x, y] = pxToCell(e);

  const entities = filter(
    ECS.entities,
    entity =>
      entity.components.position.x === x && entity.components.position.y === y
  );

  entities.forEach(entity => entity.print());
};

export default ECS;
