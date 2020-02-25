import { getEntity } from "../../lib/getters";

export const name = "movement";
export const reqs = ["position", "moveTo"];

export const movement = eIds => {
  eIds.forEach(eId => {
    const entity = getEntity(eId);
    const { moveTo } = entity.components;

    entity.components.position.x += moveTo.x;
    entity.components.position.y += moveTo.y;

    entity.removeComponent("moveTo");
  });
};
