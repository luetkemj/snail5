import Entity from "../Entity";
import { chars, colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import moveToTarget from "../goals/moveToTarget";
import lightTargetOnFire from "../goals/lightTargetOnFire";

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
  entity.addComponent("name", {
    name: "Bonfire",
    plural: "bonfires",
    possesive: "bonfire's"
  });
  entity.addComponent("canBeOnLegend");

  entity.addComponent("activities", {
    BORED: [
      {
        procedure: [moveToTarget, lightTargetOnFire],
        target: entity.id
      }
    ]
  });

  return entity;
};

export default fireAssemblage;
