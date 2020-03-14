import { some } from "lodash";

import { getEntity } from "./getters";
import { getDirection, getNeighborIds, idToCell } from "./grid";

import ECS from "../ECS";

export const floodFill = startLoc => {
  const frontier = [startLoc];
  const visited = {};

  while (frontier.length) {
    const current = frontier.pop();

    const currentCell = idToCell(current);
    const neighbors = getNeighborIds(currentCell.x, currentCell.y);

    neighbors.forEach(nLocId => {
      if (
        !visited[nLocId] &&
        !some(
          ECS.cache.entitiesAtLocation[nLocId],
          eId => getEntity(eId).components.isBlocking
        )
      ) {
        frontier.push(nLocId);
        visited[nLocId] = true;
      }
    });
  }

  return visited;
};

export const breadthFirst = (startLoc, goalLoc) => {
  const frontier = [startLoc];
  const cameFrom = {};

  while (frontier.length) {
    const current = frontier.pop();

    const currentCell = idToCell(current);
    const neighbors = getNeighborIds(currentCell.x, currentCell.y);
    let complete = false;

    neighbors.forEach(nLocId => {
      if (
        !cameFrom[nLocId] &&
        !some(
          ECS.cache.entitiesAtLocation[nLocId],
          eId => getEntity(eId).components.isBlocking
        )
      ) {
        frontier.unshift(nLocId);
        cameFrom[nLocId] = current;

        ECS.cache.entitiesAtLocation[nLocId] &&
          ECS.cache.entitiesAtLocation[nLocId].forEach(id => {
            const direction = getDirection(current, nLocId);
            getEntity(id).components.breadthFirst = direction;
            getEntity(id).components.cameFrom = current;
          });
        // else if this is true we have reached our goal and can stop the search
      } else if (goalLoc && nLocId === goalLoc) {
        complete = true;
      }
    });

    if (complete) break;
  }

  return cameFrom;
};
