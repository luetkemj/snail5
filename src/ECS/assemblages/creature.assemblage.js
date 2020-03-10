import Entity from "../Entity";
import { colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

const creatureAssemblage = () => {
  const entity = Entity();
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.player
  });
  entity.addComponent("isOpaque");
  entity.addComponent("isBlocking");

  return entity;
};

export default creatureAssemblage;
