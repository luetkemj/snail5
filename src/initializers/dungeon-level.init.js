import createBonfire from "../ECS/assemblages/bonfire.assemblage";
import { getECS } from "../lib/getters";
import Entity from "../ECS/Entity";
import { generateDungeon } from "../lib/dungeon";
import { colors, chars } from "../lib/graphics";

const initDungeonLevel = () => {
  // create dungeon level
  const dungeon = generateDungeon({
    x: getECS().game.grid.map.x,
    y: getECS().game.grid.map.y,
    width: getECS().game.grid.map.width,
    height: getECS().game.grid.map.height,
    maxRoomCount: 30,
    minRoomSize: 6,
    maxRoomSize: 12
  });

  Object.keys(dungeon.tiles).forEach(tileId => {
    const entity = Entity();
    const currTile = dungeon.tiles[tileId];
    let char;
    let color;

    if (currTile.sprite === "WALL") {
      char = chars.wall;
      color = colors.wall;
      entity.addComponent("isBlocking");
      entity.addComponent("isOpaque");
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

    getECS().entities[entity.id] = entity;
  });

  dungeon.rooms.forEach((room, index) => {
    if (index === 0) {
      createBonfire(room.center.x + 1, room.center.y + 1);
    } else {
      createBonfire(room.center.x, room.center.y);
    }
  });

  return dungeon;
};

export default initDungeonLevel;
