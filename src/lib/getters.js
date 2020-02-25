import ECS from "../ECS";

export const getEntity = eId => ECS.entities[eId];

export const getPlayer = () => getEntity(ECS.game.playerId);
