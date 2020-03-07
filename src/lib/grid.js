import ECS from "../ECS";
import { sample } from "lodash";

export const CARDINAL = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];

export const rectangle = ({ x, y, width, height, hasWalls }, tileProps) => {
  const tiles = {};

  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  if (hasWalls) {
    for (let yi = y1 + 1; yi < y2 - 1; yi++) {
      for (let xi = x1 + 1; xi < x2 - 1; xi++) {
        tiles[`${xi},${yi}`] = { x: xi, y: yi, ...tileProps };
      }
    }
  } else {
    for (let yi = y1; yi < y2; yi++) {
      for (let xi = x1; xi < x2; xi++) {
        tiles[`${xi},${yi}`] = { x: xi, y: yi, ...tileProps };
      }
    }
  }

  const center = {
    x: Math.round((x1 + x2) / 2),
    y: Math.round((y1 + y2) / 2)
  };

  return { x1, x2, y1, y2, center, hasWalls, tiles };
};

// export const circle = (center, radius, grid) => {
//   const locIds = [];
//   grid.forEach(cell => {
//     if (distance(center, cell) <= radius) {
//       locIds.push(cellToId(cell));
//     }
//   });

//   console.log(locIds);
//   return locIds;
// };

export const rectsIntersect = (rect1, rect2) => {
  return (
    rect1.x1 <= rect2.x2 &&
    rect1.x2 >= rect2.x1 &&
    rect1.y1 <= rect2.y2 &&
    rect1.y2 >= rect2.y1
  );
};

export const distance = (cell1, cell2) => {
  const x = Math.pow(cell2.x - cell1.x, 2);
  const y = Math.pow(cell2.y - cell1.y, 2);
  return Math.floor(Math.sqrt(x + y));
};

export const idToCell = id => {
  const coords = id.split(",");
  return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};

export const cellToId = ({ x, y }) => `${x},${y}`;

export const isOnMapEdge = (x, y) => {
  const { width, height, x: mapX, y: mapY } = ECS.game.grid.map;

  if (x === mapX) return true; // west edge
  if (y === mapY) return true; // north edge
  if (x === mapX + width - 1) return true; // east edge
  if (y === mapY + height - 1) return true; // south edge
  return false;
};

export const getNeighbors = (x, y) => {
  const points = [];
  for (let direction of CARDINAL) {
    let candidate = {
      x: x + direction.x,
      y: y + direction.y
    };
    if (
      candidate.x >= 0 &&
      candidate.x < ECS.game.grid.width &&
      candidate.y >= 0 &&
      candidate.y < ECS.game.grid.height
    ) {
      points.push(candidate);
    }
  }
  return points;
};

export const getNeighborIds = (x, y) => getNeighbors(x, y).map(cellToId);

export const randomNeighbor = (startX, startY) => {
  const direction = sample(CARDINAL);
  const x = startX + direction.x;
  const y = startY + direction.y;
  return { x, y };
};

export const getNeighbor = (x, y, dir) => {
  const dirMap = { N: 0, E: 1, S: 2, W: 3 };
  const direction = CARDINAL[dirMap[dir]];
  return {
    x: x + direction.x,
    y: y + direction.y
  };
};
