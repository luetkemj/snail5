import createFOV from "../../lib/fov";
import { getECS, getEntity, getPlayer } from "../../lib/getters";

export const name = "fov";
export const reqs = ["position", "appearance"];

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

  let opaqueLocations = [];

  Object.keys(entities).forEach(eId => {
    const entity = getEntity(eId);
    if (entity.components.isOpaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      opaqueLocations.push(locId);
    }
  });

  const FOV = createFOV(opaqueLocations, width, height, originX, originY, 100);

  eIds.forEach(eId => {
    const entity = getEntity(eId);
    const locId = `${entity.components.position.x},${entity.components.position.y}`;
    if (FOV.fov.includes(locId)) {
      entity.addComponent("isInFov");

      if (entity.components.light && entity.components.light.a > 0) {
        entity.addComponent("isRevealed");
      }
    } else {
      entity.removeComponent("isInFov");
    }
  });
};
