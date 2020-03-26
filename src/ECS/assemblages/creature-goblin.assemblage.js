import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const goblinAssemblage = (x, y) => {
  const entity = createCreature();

  entity.updateComponent("appearance", {
    char: chars.goblin,
    color: colors.goblin
  });

  entity.addComponent("position", { x, y });

  entity.addComponent("name", {
    name: "Goblin",
    possesive: "goblin's"
  });

  return entity;
};

export default goblinAssemblage;
