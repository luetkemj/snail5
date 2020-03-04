import Entity from "../Entity";
import { chars, colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

const fireAssemblage = (x, y) => {
  const entity = Entity();

  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.player,
    char: chars.campfire,
    color: colors.campfire
  });
  entity.addComponent("position", { x, y });
  entity.addComponent("isBlocking");
  entity.addComponent("lightsource", { range: 8, color: colors.campfire });

  return entity;
};

export default fireAssemblage;
