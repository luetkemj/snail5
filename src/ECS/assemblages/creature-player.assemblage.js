import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.updateComponent("appearance", {
    char: chars.player,
    color: colors.player
  });

  entity.addComponent("position", { x, y });
  entity.addComponent("lightsource", { range: 2.5 });
  entity.addComponent("name", {
    name: "You",
    possesive: "your"
  });
  entity.addComponent("canBeOnLegend");

  return entity;
};

export default playerAssemblage;
