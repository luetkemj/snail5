import { colors } from "../../lib/graphics";

const componentLightsource = (params = {}) => {
  return {
    range: params.range || 1,
    color: params.color || colors.torchLight,
    weight: params.weight || 0.1
  };
};

export default componentLightsource;
