import createPlayer from "../ECS/assemblages/creature-player.assemblage";
import initDungeonLevel from "../initializers/dungeon-level.init";

const initGame = () => {
  initDungeonLevel();

  // Create player
  const player = createPlayer(10, 10);
};

export default initGame;
