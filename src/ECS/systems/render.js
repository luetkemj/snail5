import ECS from "..";
import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";

export const name = "render";
export const reqs = ["appearance", "position", "fov"];
export const render = eIds => {
  clearCanvas();

  // render map
  const entities = eIds.reduce((acc, val) => {
    acc[val] = ECS.entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      const { appearance, position, fov } = entity.components;
      if (appearance && position && fov.inFov) {
        return drawCell(entity);
      }

      if (fov.showIfRevealed && fov.revealed && !fov.inFov) {
        drawCell(entity, { char: { da: -75, ds: 0 } });
      }
    });
  });
};
