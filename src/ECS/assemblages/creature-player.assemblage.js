import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.components.appearance.char = chars.player;
  entity.components.appearance.color = colors.player;

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("lightsource", { range: 2.5 });

  entity.addComponent("name", {
    name: "You",
    possesive: "your"
  });

  entity.addComponent("canBeOnLegend");

  return entity;
};

export default playerAssemblage;
