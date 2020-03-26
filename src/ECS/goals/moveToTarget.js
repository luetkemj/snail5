import { isNeighbor, cellToId } from "../../lib/grid";
import { aStar } from "../../lib/pathfinding";

const moveToTarget = (actor, target) => {
  const isFinished = () => {
    if (actor.components.position && target.components.position) {
      if (isNeighbor(actor.components.position, target.components.position)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const takeAction = () => {
    const path = aStar(
      cellToId(actor.components.position),
      cellToId(target.components.position)
    );

    // should be attempt to move function that accounts for all the blocking things that could happen...
    actor.updateComponent("position", { x: path[1].col, y: path[1].row });
  };

  return {
    isFinished,
    takeAction
  };
};

export default moveToTarget;
