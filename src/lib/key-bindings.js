import ECS from "../ECS";

export default function input(key) {
  switch (key) {
    case "ArrowUp":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 0, y: -1 } };
      break;
    case "ArrowDown":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 0, y: 1 } };
      break;
    case "ArrowLeft":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: -1, y: 0 } };
      break;
    case "ArrowRight":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 1, y: 0 } };
      break;
    case "Escape": {
      ECS.game.userInput = { key, type: "ESCAPE", payload: {} };
      break;
    }
  }
}
