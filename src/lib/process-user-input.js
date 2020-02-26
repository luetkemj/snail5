import ECS from "../ECS";
import { getPlayer } from "./getters";

const processUserInput = () => {
  const { userInput } = ECS.game;

  if (!userInput) {
    return;
  }

  const { key, type, payload } = userInput;
  const player = getPlayer();

  if (type === "MOVE") {
    player.addComponent("moveTo", payload);
  }
};

export default processUserInput;
