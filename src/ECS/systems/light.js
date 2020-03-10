import { groupBy } from "lodash";
import { getECS, getEntity, getPlayer } from "../../lib/getters";
import createFOV from "../../lib/fov";
import { getNeighborIds } from "../../lib/grid";

import ECS from "../index";

export const name = "light";
export const reqs = ["lightsource", "position", "appearance"];

export const light = eIds => {
  const {
    game: {
      grid: { width, height }
    }
  } = getECS();

  let opaqueLocations = [];
  const entitiesByLocation = ECS.cache.entitiesAtLocation;

  Object.keys(getECS().entities).forEach(eId => {
    const entity = getEntity(eId);
    // remove light component from everyone to start fresh
    entity.removeComponent("light");
    if (entity.components.isOpaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      opaqueLocations.push(locId);
    }
  });

  // store lit entity ids so we can mix light colors later
  const litEntityIds = [];

  // initial lighting
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

      if (entitiesByLocation[locId]) {
        entitiesByLocation[locId].forEach(entityId => {
          const entity = getEntity(entityId);

          if (!entity.components.isOpaque) {
            if (entity.components.light) {
              const a = entity.components.light.a + opacity;
              entity.updateComponent("light", { a });
            } else {
              entity.addComponent("light", { a: opacity });
              litEntityIds.push(entity.id);
            }

            const sources = [...entity.components.light.sources, eId];
            entity.updateComponent("light", { sources });
          }

          if (entity.components.lightsource) {
            entity.addComponent("light", { a: 100 });

            const sources = [...entity.components.light.sources, eId];
            entity.updateComponent("light", { sources });
            litEntityIds.push(entity.id);
          }
        });
      }
    });
  });

  // light source mixing
  Object.keys(getECS().entities).forEach(eId => {
    const entity = getEntity(eId);
    const { appearance, light } = entity.components;

    if (light) {
      light.sources.forEach(sourceId => {
        const { color, weight } = getEntity(sourceId).components.lightsource;
        let fg = appearance.color.alpha(light.a / 100);

        const mixedColor = fg.mix(color, weight);
        entity.updateComponent("light", { color: mixedColor });
      });
    }
  });

  // Opaque entities lighting
  // todo: don't getPlayer() use a component instead...
  const pOriginX = getPlayer().components.position.x;
  const pOriginY = getPlayer().components.position.y;
  const FOV = createFOV(
    opaqueLocations,
    width,
    height,
    pOriginX,
    pOriginY,
    100
  );

  Object.keys(getECS().entities).forEach(eId => {
    const entity = getEntity(eId);
    // test for opaque locations that are not a lightsource.
    if (entity.components.isOpaque && !entity.components.lightsource) {
      let brightestLight = 0;
      let light = null;

      // get all of it's neighbors
      const locIds = getNeighborIds(
        entity.components.position.x,
        entity.components.position.y
      ).filter(locId => FOV.fov.includes(locId));

      // get brightest light from all neighbors and set light to that
      // if no neighors are lit - stay dark :)
      locIds.forEach(locId => {
        if (entitiesByLocation[locId]) {
          entitiesByLocation[locId].forEach(id => {
            const e = getEntity(id);
            if (e.components.light && !e.components.isOpaque) {
              if (brightestLight < e.components.light.a) {
                brightestLight = e.components.light.a;
                light = {
                  a: e.components.light.a,
                  sources: e.components.light.sources
                };
              }
            }
          });
        }
      });

      if (brightestLight) {
        entity.addComponent("light", light);
        entity.components.light.sources.forEach(sourceId => {
          const { color, weight } = getEntity(sourceId).components.lightsource;
          let fg = entity.components.appearance.color.alpha(light.a / 100);

          const mixedColor = fg.mix(color, weight);
          entity.updateComponent("light", { color: mixedColor });
        });
      }
    }
  });
};
