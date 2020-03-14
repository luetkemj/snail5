import { some } from "lodash";
import { getEntity, getECS } from "./getters";
import { getDirection, getNeighborIds, idToCell } from "./grid";
import ECS from "../ECS";

import FlatQueue from "flatqueue";

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

// manhattan distance on a square grid
// https://www.redblobgames.com/pathfinding/a-star/introduction.html#greedy-best-first
export const heuristic = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const aStar = (start, goal) => {
  const q = new FlatQueue();
  q.push(start, 0);

  const cameFrom = {};

  const costSoFar = {};
  costSoFar[start] = 0;

  while (q.peek()) {
    const current = q.pop();

    if (current === goal) break;

    const neighbors = getNeighborIds(idToCell(current).x, idToCell(current).y);

    neighbors.forEach(nLocId => {
      const newCost = costSoFar[current] || 0; // + graph.cost(current, next) cells should have a movement cost that we add here -- https://www.redblobgames.com/pathfinding/a-star/introduction.html#astar
      if (!costSoFar[nLocId] || newCost < costSoFar[nLocId]) {
        costSoFar[nLocId] = newCost;

        const priority = newCost + heuristic(idToCell(goal), idToCell(nLocId));

        q.push(nLocId, priority);

        cameFrom[nLocId] = current;

        getECS().cache.entitiesAtLocation[nLocId] &&
          getECS().cache.entitiesAtLocation[nLocId].forEach(id => {
            const direction = getDirection(current, nLocId);
            getEntity(id).components.breadthFirst = direction;
            getEntity(id).components.cameFrom = current;
          });
      }
    });
  }

  console.log({
    cameFrom,
    costSoFar,
    start,
    goal
  });

  return cameFrom;
};
