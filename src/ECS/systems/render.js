import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { getECS } from "../../lib/getters";

export const name = "render";
export const reqs = ["appearance", "position"];
export const render = eIds => {
  clearCanvas();
  // render map
  const entities = eIds.reduce((acc, val) => {
    acc[val] = getECS().entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      const { appearance, position, isInFov, light } = entity.components;
      if (isInFov && light) {
        if (light.color && light.a > 0) drawCell(entity, { fg: light.color });
      }

      if (entity.components.isRevealed) {
        if (!isInFov || (isInFov && !light) || (isInFov && light <= 0)) {
          drawCell(entity, {
            fg: appearance.color
              .alpha(0.075)
              .saturationl(100)
              .hue(200)
          });
        }
      }
    });
  });
};
