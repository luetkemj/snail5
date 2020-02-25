import ECS from "../ECS";
import { getPlayer } from "./getters";

export default function processUserInput() {
  const { userInput } = ECS.game;

  if (!userInput) {
    return;
  }

  const { key, type, payload } = userInput;
  const player = getPlayer();

  if (type === "MOVE") {
    player.addComponent("moveTo", payload);
  }
}
