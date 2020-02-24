import ECS from "../ECS";
import Entity from "../ECS/Entity";
import {
  setCacheEntityAtLocation,
  setCacheId,
  setCacheTileLocations
} from "../ECS/cache";

import { generateDungeon } from "../lib/dungeon";
import { colors, chars } from "../lib/graphics";

const initDungeonLevel = () => {
  // create dungeon level
  const dungeon = generateDungeon({
    x: ECS.game.grid.map.x,
    y: ECS.game.grid.map.y,
    width: ECS.game.grid.map.width,
    height: ECS.game.grid.map.height,
    maxRoomCount: 30,
    minRoomSize: 6,
    maxRoomSize: 12
  });

  console.log(dungeon);

  Object.keys(dungeon.tiles).forEach(tileId => {
    const entity = Entity();
    const currTile = dungeon.tiles[tileId];
    let char;
    let color;

    if (currTile.sprite === "WALL") {
      char = chars.wall;
      color = colors.wall;
    }
    if (currTile.sprite === "FLOOR") {
      char = chars.floor;
      color = colors.floor;
    }
    if (currTile.sprite === "CAVERN_FLOOR") {
      char = chars.cavernFloor;
      color = colors.cavernFloor;
    }
    entity.addComponent("appearance", { char, color });
    entity.addComponent("position", { x: currTile.x, y: currTile.y });

    ECS.entities[entity.id] = entity;
    // add to cache
    setCacheTileLocations(entity.id, entity.components.position);
    setCacheEntityAtLocation(entity.id, entity.components.position);
    if (!currTile.blocking) {
      setCacheId(entity.id, "openTiles");
    }
  });
};

export default initDungeonLevel;
