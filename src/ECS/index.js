import { filter } from "lodash";
import { pxToCell } from "../lib/canvas";
import activities from "./components/activities";
import appearance from "./components/appearance";
import brain from "./components/brain";
import isBlocking from "./components/is-blocking";
import canBeOnLegend from "./components/can-be-on-legend";
import isInFov from "./components/is-in-fov";
import isRevealed from "./components/is-revealed";
import light from "./components/light";
import lightsource from "./components/lightsource";
import moveTo from "./components/move-to";
import name from "./components/name";
import needs from "./components/needs";
import isOpaque from "./components/is-opaque";
import position from "./components/position";

import * as fovSystem from "./systems/fov";
import * as lightSystem from "./systems/light";
import * as movementSystem from "./systems/movement";
import * as aiSystem from "./systems/ai";
import * as renderSystem from "./systems/render";

const ECS = {
  entities: {},
  components: {
    activities,
    appearance,
    brain,
    isBlocking,
    canBeOnLegend,
    isInFov,
    isRevealed,
    light,
    lightsource,
    moveTo,
    name,
    needs,
    isOpaque,
    position
  },
  systems: [aiSystem, movementSystem, fovSystem, lightSystem, renderSystem],
  game: {
    playerId: null,
    paused: false,
    turn: 0,
    userInput: null,
    playerTurn: true,
    grid: {
      width: 100,
      height: 34,
      legend: {
        width: 20,
        height: 34,
        x: 0,
        y: 0
      },
      map: {
        width: 79,
        height: 29,
        x: 21,
        y: 3
      }
    }
  },
  cache: {
    entitiesAtLocation: {}
  }
};

// it's a PITA to mock canvas in jest so we just hack it's running
if (process.env.NODE_ENV !== "test") {
  const canvas = document.querySelector("#canvas");

  canvas.onclick = e => {
    const [x, y] = pxToCell(e);

    const entities = filter(
      ECS.entities,
      entity =>
        entity.components.position.x === x && entity.components.position.y === y
    );

    entities.forEach(entity => entity.print());

    console.log(`${x},${y}`, { ECS });
  };
}

export default ECS;
