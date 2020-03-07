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
  entity.addComponent("lightsource", { range: 3.5, color: colors.campfire });
  entity.addComponent("name", {
    name: "Bonfire",
    plural: "bonfires",
    possesive: "bonfire's"
  });
  entity.addComponent("canBeOnLegend");

  return entity;
};

export default fireAssemblage;
