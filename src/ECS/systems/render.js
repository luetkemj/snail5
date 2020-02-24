import ECS from "..";
import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";

export const name = "render";
export const reqs = ["appearance", "position"];

export default function render(eIds) {
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
      const { appearance, position } = entity.components;
      if (appearance && position) {
        return drawCell(entity);
      }
    });
  });
}
