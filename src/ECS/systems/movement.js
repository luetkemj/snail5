import { filter } from "lodash";
import { getECS, getEntity } from "../../lib/getters";

export const name = "movement";
export const reqs = ["position", "moveTo"];

export const movement = eIds => {
  eIds.forEach(eId => {
    const entity = getEntity(eId);

    const { position, moveTo } = entity.components;

    const mPos = {
      x: position.x + moveTo.x,
      y: position.y + moveTo.y
    };

    const { width, height, x, y } = getECS().game.grid.map;

    // observe map boundaries
    const mx = Math.min(width + x - 1, Math.max(x, mPos.x));
    const my = Math.min(height + y - 1, Math.max(y, mPos.y));

    // check for blocking entities at target location
    // todo: PERF
    const blockers = filter(getECS().entities, e => {
      return (
        e.components.position.x === mx &&
        e.components.position.y === my &&
        e.components.blocking
      );
    });

    if (blockers.length) {
      // don't move!
      return entity.removeComponent("moveTo");
    }

    entity.components.position.x = mx;
    entity.components.position.y = my;

    entity.removeComponent("moveTo");
  });
};
