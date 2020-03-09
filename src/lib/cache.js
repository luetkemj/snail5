import { findIndex } from "lodash";
import ECS from "../ECS";

export const setCacheEntityAtLocation = entity => {
  const {
    id,
    components: { position }
  } = entity;

  const loc = `${position.x},${position.y}`;

  ECS.cache.entitiesAtLocation[loc] = ECS.cache.entitiesAtLocation[loc] || [];

  ECS.cache.entitiesAtLocation[loc].push(id);
};

// remove single entity Id from array at loc in entitiesAtLocation
export const removeCacheEntityAtLocation = entity => {
  const {
    id,
    components: { position }
  } = entity;

  const loc = `${position.x},${position.y}`;
  const index = findIndex(ECS.cache.entitiesAtLocation[loc], x => x === id);
  return ECS.cache.entitiesAtLocation[loc].splice(index, 1);
};
