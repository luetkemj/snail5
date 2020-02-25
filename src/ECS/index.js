import appearance from "./components/appearance";
import moveTo from "./components/move-to";
import position from "./components/position";

import * as renderSystem from "./systems/render";
import * as movementSystem from "./systems/movement";

export const ECS = {
  entities: {},
  components: {
    appearance,
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

export default ECS;
