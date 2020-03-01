import { groupBy } from "lodash";
import createFOV from "../../lib/fov";
import { getECS, getEntity, getPlayer } from "../../lib/getters";

export const name = "fov";
export const reqs = ["position"];

export const fov = eIds => {
  const {
    entities,
    game: {
      grid: { width, height }
    }
  } = getECS();

  // todo: don't getPlayer() use a component instead...
  const originX = getPlayer().components.position.x;
  const originY = getPlayer().components.position.y;

  let blockingLocations = [];
  const entitiesByLocation = groupBy(entities, entity => {
    const { x, y } = entity.components.position;
    const locId = `${x},${y}`;
    return locId;
  });

  Object.keys(entities).forEach(eId => {
    const entity = getEntity(eId);
    if (entity.components.opaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      blockingLocations.push(locId);
    }
  });

  const FOV = createFOV(
    blockingLocations,
    width,
    height,
    originX,
    originY,
    100
  );

  eIds.forEach(eId => {
    const entity = getEntity(eId);
    const locId = `${entity.components.position.x},${entity.components.position.y}`;
    if (FOV.fov.includes(locId)) {
      entity.addComponent("inFov");
    } else {
      entity.removeComponent("inFov");
    }
  });
};
