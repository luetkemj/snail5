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

  let opaqueLocations = [];
  const entitiesByLocation = groupBy(getECS().entities, entity => {
    const { x, y } = entity.components.position;
    const locId = `${x},${y}`;
    return locId;
  });

  Object.keys(getECS().entities).forEach(eId => {
    const entity = getEntity(eId);
    // remove light component from everyone to start fresh
    entity.removeComponent("light");
    if (entity.components.isOpaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      opaqueLocations.push(locId);
    }
  });

  eIds.forEach(eId => {
    const lsEntity = getEntity(eId);
    const { range } = lsEntity.components.lightsource;
    const originX = lsEntity.components.position.x;
    const originY = lsEntity.components.position.y;

    const FOV = createFOV(
      opaqueLocations,
      width,
      height,
      originX,
      originY,
      range
    );

    const { fov, distance } = FOV;

    fov.forEach(locId => {
      const opacity = ((range - distance[locId]) / range) * 100;

      entitiesByLocation[locId].forEach(entity => {
        if (!entity.components.isOpaque) {
          if (entity.components.light) {
            entity.components.light.a += opacity;
          } else {
            entity.addComponent("light", { a: opacity });
          }

          entity.components.light.sources.push(eId);
        }

        if (entity.components.lightsource) {
          entity.addComponent("light", { a: 100 });
          entity.components.light.sources.push(eId);
        }
      });
    });
  });
};
