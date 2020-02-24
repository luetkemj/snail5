import ECS from "./ECS";
import initGame from "./initializers/game.init";

document.addEventListener("keydown", ev => console.log(ev.key));

initGame();

function gameTick() {
  if (!ECS.game.paused) {
    for (let i = 0; i < ECS.systems.length; i++) {
      ECS.systems[i](ECS.entities);
    }
  } else {
    renderSystem(ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  if (ECS.game.userInput && ECS.game.playerTurn) {
    processUserInput();
    gameTick();
    ECS.game.userInput = null;
    ECS.game.turn = ECS.game.turn += 1;
    ECS.game.playerTurn = false;
  }

  if (!ECS.game.playerTurn) {
    gameTick();
    ECS.game.playerTurn = true;
  }
}

function gameLoop() {
  // console.time("tick");
  update();
  // console.timeEnd("tick");
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
