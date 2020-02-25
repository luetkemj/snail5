const moveTo = function componentMoveTo(params = {}) {
  const { x = 0, y = 0 } = params;

  return {
    x,
    y
  };
};

export default moveTo;
