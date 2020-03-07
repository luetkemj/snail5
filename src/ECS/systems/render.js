import { groupBy, sortBy } from "lodash";

import { distance } from "../../lib/grid";
import { colors } from "../../lib/graphics";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { getECS, getEntity, getPlayer } from "../../lib/getters";

export const name = "render";
export const reqs = ["appearance"];

// todo: move to lib
const buildCharEntity = ({
  char,
  color = colors.hudText,
  background = colors.defaultBGColor,
  x,
  y
}) => ({
  components: {
    appearance: {
      char,
      color,
      background
    },
    position: {
      x,
      y
    }
  }
});

const drawText = (
  text,
  { color = colors.hudText, background = "transparent", x, y, charAlpha = 100 }
) => {
  text.split("").forEach((char, charIdx) => {
    const charEntity = buildCharEntity({
      char,
      color,
      background,
      x: charIdx + x,
      y: y
    });
    drawCell(charEntity, { char: { a: charAlpha } });
  });
};

const drawNameplate = (entity, { x, y }) => {
  drawCell(entity, { fg: entity.components.light.color, x, y });

  drawText(entity.components.name.name, { x: x + 2, y });
};

export const render = eIds => {
  clearCanvas();
  // render map
  const entities = eIds.reduce((acc, val) => {
    acc[val] = getECS().entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);

  const entitiesInLegend = [];

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      const {
        appearance,
        isInFov,
        light,
        name,
        canBeOnLegend
      } = entity.components;
      if (isInFov && light) {
        if (light.color && light.a > 0) drawCell(entity, { fg: light.color });

        // put eId into array so we can order it and render later
        if ((appearance, isInFov, light, name, canBeOnLegend)) {
          entitiesInLegend.push(entity);
        }
      }

      if (entity.components.isRevealed) {
        if (!isInFov || (isInFov && !light) || (isInFov && light <= 0)) {
          drawCell(entity, {
            fg: appearance.color
              .alpha(0.1)
              .saturationl(100)
              .hue(200)
          });
        }
      }
    });
  });

  const player = getPlayer();
  const orderedLegend = sortBy(entitiesInLegend, entity => {
    distance(entity.components.position, player.components.position);
  });

  orderedLegend
    .reverse()
    .forEach((entity, index) => drawNameplate(entity, { x: 1, y: 1 + index }));
};
