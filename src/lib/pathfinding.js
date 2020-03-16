import { some, each } from "lodash";
import { getEntity, getECS } from "./getters";
import { getDirection, getNeighborIds, idToCell } from "./grid";

import { PathFinding } from "astarjs";

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
          getECS().cache.entitiesAtLocation[nLocId],
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
          getECS().cache.entitiesAtLocation[nLocId],
          eId => getEntity(eId).components.isBlocking
        )
      ) {
        frontier.unshift(nLocId);
        cameFrom[nLocId] = current;

        getECS().cache.entitiesAtLocation[nLocId] &&
          getECS().cache.entitiesAtLocation[nLocId].forEach(id => {
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

const pfm = new PathFinding();

export const aStar = (startLocId, endLocId) => {
  const start = idToCell(startLocId);
  const end = idToCell(endLocId);

  const {
    width: mapWidth,
    height: mapHeight,
    x: mapx,
    y: mapy
  } = getECS().game.grid.map;

  const grid = Array(mapHeight)
    .fill(1)
    .map(x => Array(mapWidth).fill(1));

  each(getECS().cache.entitiesAtLocation, (val, locId) => {
    if (!some(val, eId => getEntity(eId).components.isBlocking)) {
      const loc = idToCell(locId);
      grid[loc.y - mapy][loc.x - mapx] = 0;
    }
  });

  // // this should be cached maybe?
  pfm.setWalkable(0);
  pfm.setStart({ col: start.x - mapx, row: start.y - mapy });
  pfm.setEnd({ col: end.x - mapx, row: end.y - mapy });

  const result = pfm.find(grid);
  console.log(result);
  return result;
};
