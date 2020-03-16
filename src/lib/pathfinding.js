import { some, each } from "lodash";
import { getEntity, getECS } from "./getters";
import { getDirection, getNeighborIds, idToCell } from "./grid";

// import jsAstar from "javascript-astar";
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

// manhattan distance on a square grid
// https://www.redblobgames.com/pathfinding/a-star/introduction.html#greedy-best-first
export const heuristic = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const pfm = new PathFinding();

export const aStar = (startLocId, endLocId) => {
  const start = idToCell(startLocId);
  const end = idToCell(endLocId);

  const { width, height } = getECS().game.grid.map;

  const grid = Array(29)
    .fill(1)
    .map(x => Array(74).fill(1));

  each(getECS().cache.entitiesAtLocation, (val, locId) => {
    if (!some(val, eId => getEntity(eId).components.isBlocking)) {
      const loc = idToCell(locId);
      // debugger;
      grid[loc.y - 3][loc.x - 21] = 0;
    }
  });

  // // this should be cached maybe?
  pfm.setWalkable(0);
  pfm.setStart({ col: start.x - 21, row: start.y - 3 });
  pfm.setEnd({ col: end.x - 21, row: end.y - 3 });

  const result = pfm.find(grid);
  console.log(result);
  return result;
};

// export const aStar = (start, goal) => {
//   const { width, height } = getECS().game.grid.map;

//   // this should be cached maybe?
//   const grid = Array(width)
//     .fill(0)
//     .map(x => Array(height).fill(0));

// each(getECS().cache.entitiesAtLocation, (val, locId) => {
//   if (!some(val, eId => getEntity(eId).components.isBlocking)) {
//     const loc = idToCell(locId);
//     grid[loc.x - 21][loc.y - 3] = 1;
//   }
// });

//   const graph = new jsAstar.Graph(grid);

//   const startLoc = idToCell(start);
//   const endLoc = idToCell(goal);

//   const graphStart = graph.grid[startLoc.x][startLoc.y];
//   const graphEnd = graph.grid[endLoc.x][endLoc.y];

//   return jsAstar.astar.search(graph, graphStart, graphEnd);
// };
