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
        drawCell(entity, { char: { a: lux, ds: 0 } });
      }

      if (entity.components.isRevealed) {
        if (!isInFov || (isInFov && !lux)) {
          drawCell(entity, { char: { a: 7.5, s: 100, h: 200 } });
        }
      }
    });
  });

  console.log(getPlayer());
};
