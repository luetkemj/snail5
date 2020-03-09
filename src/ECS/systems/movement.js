import { filter } from "lodash";
import { getECS, getEntity } from "../../lib/getters";
import {
  setCacheEntityAtLocation,
  removeCacheEntityAtLocation
} from "../../lib/cache";

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
        e.components.isBlocking
      );
    });

    if (blockers.length) {
      // don't move!
      return entity.removeComponent("moveTo");
    }

    // entity is about to move. remove from entitiesAtLocation cache
    removeCacheEntityAtLocation(entity);

    // move!
    entity.components.position.x = mx;
    entity.components.position.y = my;

    // entity has moved. add to entitiesAtLocation cache
    setCacheEntityAtLocation(entity);

    entity.removeComponent("moveTo");
  });
};
