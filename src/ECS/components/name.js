const name = (params = {}) => ({
  name: params.name,
  plural: params.plural,
  possesive: params.possesive
});

export default name;
