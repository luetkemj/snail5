import { each, every } from "lodash";
import ECS from "./ECS";
import initGame from "./initializers/game.init";
import processUserInput from "./lib/process-user-input";
import userInput from "./lib/key-bindings";

document.addEventListener("keydown", ev => userInput(ev.key));

initGame();

function gameTick() {
  const sysManager = {};

  each(ECS.entities, entity => {
    // test each entity against each system for reqs (required components)
    each(ECS.systems, system => {
      if (every(system.reqs, req => entity.components[req])) {
        sysManager[system.name] = sysManager[system.name] || [];
        sysManager[system.name].push(entity.id);
      }
    });
  });

  if (!ECS.game.paused) {
    ECS.systems.forEach(system => {
      if (sysManager[system.name]) {
        system[system.name](sysManager[system.name]);
      }
    });
  } else {
    renderSystem(ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  // if (ECS.game.userInput && ECS.game.playerTurn) {
  if (ECS.game.userInput) {
    processUserInput();
    gameTick();
    ECS.game.userInput = null;
    ECS.game.turn = ECS.game.turn += 1;
    // ECS.game.playerTurn = false;
  }

  // if (!ECS.game.playerTurn) {
  //   gameTick();
  //   ECS.game.playerTurn = true;
  // }
}

function gameLoop() {
  // console.time("tick");
  update();
  // console.timeEnd("tick");
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// exporting this object seems to make parcel work properly.
// hopefully when parcel2 gets out of alpha we will know why...
export default {};
