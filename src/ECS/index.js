import { filter } from "lodash";
import { pxToCell } from "../lib/canvas";

import appearance from "./components/appearance";
import isBlocking from "./components/is-blocking";
import isInFov from "./components/is-in-fov";
import isRevealed from "./components/is-revealed";
import lightsource from "./components/lightsource";
import lux from "./components/lux";
import moveTo from "./components/move-to";
import isOpaque from "./components/is-opaque";
import position from "./components/position";

import * as fovSystem from "./systems/fov";
import * as lightSystem from "./systems/light";
import * as movementSystem from "./systems/movement";
import * as renderSystem from "./systems/render";

const ECS = {
  entities: {},
  components: {
    appearance,
    isBlocking,
    isInFov,
    isRevealed,
    lightsource,
    lux,
    moveTo,
    isOpaque,
    position
  },
  systems: [movementSystem, lightSystem, fovSystem, renderSystem],
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
