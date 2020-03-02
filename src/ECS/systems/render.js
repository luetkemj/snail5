import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { getECS, getPlayer } from "../../lib/getters";

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
      const { appearance, position, isInFov, lux } = entity.components;
      if (appearance && position && isInFov && lux >= 0) {
        appearance.color = appearance.color.alpha(lux / 100);

        const fg = appearance.color.alpha(lux / 100).mix();

        drawCell(entity, { fg });
      }

      if (entity.components.isRevealed) {
        if (!isInFov || (isInFov && !lux)) {
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
