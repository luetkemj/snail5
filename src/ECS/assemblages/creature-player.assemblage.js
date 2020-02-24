import { setCacheEntityAtLocation, setPlayerCacheId } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.components.appearance.char = chars.player;
  entity.components.appearance.color = colors.player;

  entity.components.position.x = x;
  entity.components.position.y = y;

  return entity;
};

export default playerAssemblage;
