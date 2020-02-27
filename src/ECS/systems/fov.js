import ECS from "../";
import createFOV from "../../lib/fov";
import { getEntity, getPlayer } from "../../lib/getters";

export const name = "fov";
export const reqs = ["position", "fov"];

export const fov = eIds => {
  const {
    game: {
      grid: { width, height }
    }
  } = ECS;

  const originX = getPlayer().components.position.x;
  const originY = getPlayer().components.position.y;

  // build entities structure entities at location
  let blockingLocations = [];

  eIds.forEach(eId => {
    const entity = getEntity(eId);
    if (entity.components.opaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      blockingLocations.push(locId);
    }
  });

  const FOV = createFOV(blockingLocations, width, height, originX, originY, 8);

  eIds.forEach(eId => {
    const entity = getEntity(eId);
    const locId = `${entity.components.position.x},${entity.components.position.y}`;
    if (FOV.fov.includes(locId)) {
      entity.components.fov.inFov = true;
      entity.components.fov.revealed = true;
      entity.components.fov.distance = FOV.distance[locId];
    } else {
      entity.components.fov.inFov = false;
    }
  });
};
