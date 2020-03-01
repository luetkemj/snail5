import { filter } from "lodash";
import { pxToCell } from "../lib/canvas";

import appearance from "./components/appearance";
import blocking from "./components/blocking";
import fov from "./components/fov";
import inFov from "./components/in-fov";
import lightsource from "./components/lightsource";
import lux from "./components/lux";
import moveTo from "./components/move-to";
import opaque from "./components/opaque";
import position from "./components/position";

import * as fovSystem from "./systems/fov";
import * as lightSystem from "./systems/light";
import * as movementSystem from "./systems/movement";
import * as renderSystem from "./systems/render";

const ECS = {
  entities: {},
  components: {
    appearance,
    blocking,
    fov,
    inFov,
    lightsource,
    lux,
    moveTo,
    opaque,
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
