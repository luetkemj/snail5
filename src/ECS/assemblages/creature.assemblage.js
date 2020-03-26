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
  entity.addComponent("canBeOnLegend");

  entity.addComponent("brain");
  entity.addComponent("needs", {
    // food: { current: 100, halfLife: 0.5 }
    drink: { current: 100, halfLife: 1 }
    // shelter: { current: 100, halfLife: 0 },
    // sleep: { current: 100, halfLife: 0.25 },
    // oxygen: { current: 100, halfLife: 0 }
  });

  return entity;
};

export default creatureAssemblage;
