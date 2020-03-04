const componentLight = (params = { a: 0 }) => {
  return {
    a: params.a,
    sources: params.sources || []
  };
};

export default componentLight;
