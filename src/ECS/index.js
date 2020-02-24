import appearance from "./components/appearance";
import position from "./components/position";

import renderSystem from "./systems/render";

export const ECS = {
  entities: {},
  components: {
    appearance,
    position
  },
  systems: [renderSystem],
  game: {
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
