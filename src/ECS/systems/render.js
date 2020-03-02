import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { getECS, getEntity } from "../../lib/getters";

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
      if (appearance && position && isInFov && light && light.a > 0) {
        let fg = appearance.color.alpha(light.a / 100);
        light.sources.forEach(sourceId => {
          const { color, weight } = getEntity(sourceId).components.lightsource;
          fg = fg.mix(color, weight);
        });

        drawCell(entity, { fg });
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
