import ECS from ".";
import {
  setCacheEntityAtLocation,
  removeCacheEntityAtLocation
} from "../lib/cache";

const Entity = () => {
  const id =
    (+new Date()).toString(16) + ((Math.random() * 100000000) | 0).toString(16);

  const components = {};

  const addComponent = (componentName, args = {}) => {
    const component = ECS.components[componentName](args);
    components[componentName] = component;

    // cache entity location
    if (componentName === "position") {
      setCacheEntityAtLocation(entity);
    }
  };

  const removeComponent = componentName => {
    // remove entity from cache
    if (componentName === "position") {
      removeCacheEntityAtLocation(entity);
    }

    delete components[componentName];
  };

  const print = function print() {
    console.log(JSON.parse(JSON.stringify(this, null, 2)));
  };

  const entity = {
    id,
    components,
    addComponent,
    removeComponent,
    print
  };

  ECS.entities[id] = entity;

  return entity;
};

export default Entity;
