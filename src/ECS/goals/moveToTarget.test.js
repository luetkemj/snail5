import Entity from "../Entity";
import moveToTarget from "./moveToTarget";

describe("moveToTarget", () => {
  describe("isFinished", () => {
    let actor;
    let target;
    beforeEach(() => {
      actor = Entity();
      target = Entity();
    });
    it("should work when finished", () => {
      actor.addComponent("position", { x: 0, y: 0 });
      target.addComponent("position", { x: 1, y: 0 });

      expect(moveToTarget(actor, target).isFinished()).toBe(true);
    });

    it("should work not finished", () => {
      actor.addComponent("position", { x: 0, y: 0 });
      target.addComponent("position", { x: 2, y: 0 });

      expect(moveToTarget(actor, target).isFinished()).toBe(false);
    });
  });

  describe("takeAction", () => {
    const module = require("../../lib/pathfinding");
    jest.spyOn(module, "aStar").mockImplementation(() => [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 }
    ]);

    let actor;
    let target;
    beforeEach(() => {
      actor = Entity();
      target = Entity();
    });
    it("should work", () => {
      actor.addComponent("position", { x: 0, y: 0 });
      target.addComponent("position", { x: 2, y: 0 });

      expect(actor.components.position).toEqual({ x: 0, y: 0 });
      moveToTarget(actor, target).takeAction();
      expect(actor.components.position).toEqual({ x: 1, y: 0 });
    });
  });
});
