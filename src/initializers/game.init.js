import { colors } from "../lib/graphics";

import ECS from "../ECS";
import createPlayer from "../ECS/assemblages/creature-player.assemblage";
import createGoblin from "../ECS/assemblages/creature-goblin.assemblage";
import initDungeonLevel from "../initializers/dungeon-level.init";

const initGame = () => {
  const { start } = initDungeonLevel();

  // Create player
  const player = createPlayer(start.x, start.y);

  createGoblin(start.x + 1, start.y - 1);

  ECS.game.playerId = player.id;
};

export default initGame;
