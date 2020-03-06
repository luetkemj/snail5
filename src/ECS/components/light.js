const componentLight = params => {
  return {
    a: params.a || 0,
    sources: params.sources || [],
    color: params.color || null
  };
};

export default componentLight;
