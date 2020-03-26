import { forEach, sample } from "lodash";
import { getECS, getEntity } from "../../lib/getters";
import createFOV from "../../lib/fov";

export const name = "ai";
export const reqs = ["needs", "brain", "position"];

export const ai = eIds => {
  const {
    entities,
    game: {
      grid: { width, height }
    },
    cache
  } = getECS();

  let opaqueLocations = [];
  Object.keys(entities).forEach(eId => {
    const entity = getEntity(eId);
    if (entity.components.isOpaque) {
      const locId = `${entity.components.position.x},${entity.components.position.y}`;
      opaqueLocations.push(locId);
    }
  });

  eIds.forEach(eId => {
    const entity = getEntity(eId);

    const { needs, brain, position } = entity.components;

    // adjust needs
    Object.keys(needs).forEach(need => {
      needs[need].current -= needs[need].halfLife;
    });

    // determine current goal
    // determine what action type this entity would like to satisty
    // for now just type BORED
    // look around for anything that can satisfy BORED
    // take the activies from those things and put them into your bag of possible actions
    // Pick one and do that thing

    const FOV = createFOV(
      opaqueLocations,
      width,
      height,
      position.x,
      position.y,
      100
    );

    // if there is nothing to do - find something
    if (!brain.goals.length) {
      // search all entities in FOV and look for something that can do something about being BORED

      const possibleActivities = [];

      FOV.fov.forEach(locId => {
        cache.entitiesAtLocation[locId].forEach(eId => {
          const entityInFov = getEntity(eId);

          const { activities } = entityInFov.components;

          if (activities && activities["BORED"] && activities["BORED"].length) {
            possibleActivities.push(sample(activities["BORED"]));
          }
        });
      });

      if (possibleActivities.length) {
        const activity = sample(possibleActivities);
        brain.goals.push(
          ...activity.procedure.map(goal => ({ goal, target: activity.target }))
        );
      }
    } else {
      while (brain.goals.length) {
        const { goal, target } = brain.goals[0];
        if (goal(entity, getEntity(target)).isFinished()) {
          brain.goals.shift();
        } else {
          break;
        }
      }

      // if there are any goals left do them
      if (brain.goals[0]) {
        const goal = brain.goals[0].goal;
        const actor = entity;
        const target = getEntity(brain.goals[0].target);

        goal(actor, target).takeAction();
      } else {
        console.log("done realzy. Really this time.");
      }
    }
  });
};
