import ECS from "..";
import { readCacheKey } from "../cache";
import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { colors } from "../../lib/graphics";
import { rectangle } from "../../lib/grid";

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

function render() {
  clearCanvas();

  // render map
  const entities = readCacheKey("entityIds").reduce((acc, val) => {
    acc[val] = ECS.entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      const { appearance, position } = entity.components;
      if (appearance && position) {
        return drawCell(entity);
      }
    });
  });
}

export default render;
