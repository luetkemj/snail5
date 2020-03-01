import { groupBy } from "lodash";
import { getECS, getEntity } from "../../lib/getters";
import createFOV from "../../lib/fov";

export const name = "light";
export const reqs = ["lightsource", "position"];

export const light = eIds => {
  const {
    game: {
      grid: { width, height }
    }
  } = getECS();

  let blockingLocations = [];
  const entitiesByLocation = groupBy(getECS().entities, entity => {
    const { x, y } = entity.components.position;
    const locId = `${x},${y}`;
    return locId;
  });

  Object.keys(getECS().entities).forEach(eId => {
    const entity = getEntity(eId);
    // remove lux component from everyone to start fresh
    entity.removeComponent("lux");
    if (entity.components.opaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      blockingLocations.push(locId);
    }
  });

  eIds.forEach(eId => {
    const lsEntity = getEntity(eId);
    const { range } = lsEntity.components.lightsource;
    const originX = lsEntity.components.position.x;
    const originY = lsEntity.components.position.y;

    const FOV = createFOV(
      blockingLocations,
      width,
      height,
      originX,
      originY,
      range
    );

    const { fov, distance } = FOV;

    fov.forEach(locId => {
      const opacity = ((range - distance[locId] || 1) / range) * 100;

      entitiesByLocation[locId].forEach(entity => {
        if (entity.components.lux) {
          entity.components.lux += opacity; // opacity is a negative number! may need to adjust math here...
        } else {
          entity.addComponent("lux", opacity);
        }
      });
    });
  });
};
