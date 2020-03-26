import { isNeighbor } from "../../lib/grid";
import { colors } from "../../lib/graphics";

const lightTargetOnFire = (actor, target) => {
  const isFinished = () => {
    if (
      target.components.lightsource &&
      target.components.lightsource.range > 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const takeAction = () => {
    if (actor.components.position && target.components.position) {
      if (isNeighbor(actor.components.position, target.components.position)) {
        if (!target.components.lightsource) {
          target.addComponent("lightsource", {
            range: 3.5,
            color: colors.campfire
          });
        }
      }
    }
  };

  return {
    isFinished,
    takeAction
  };
};

export default lightTargetOnFire;
