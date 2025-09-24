module.exports.flattenChilds = (client) => client.map((cl) => {
  const { childs } = cl;
  delete cl.childs;
  const arr = Object.values({ cl, ...childs });
  /*
  Object.values doesn't preserve order,
  currently the algorithm needs
  the root to be on top of at least one of its childs.
  */
  arr.unshift(arr.pop());
  return arr;
});

module.exports.flattenParents = (client) => client.map((cl) => {
  let { parents } = cl;
  delete cl.parents;
  // reverse level order (parents should start with 0, not childs)
  parents = parents.map((parent) => ({ ...parent, level: parents.length - 1 - parent.level }));
  // leaf level
  cl.level = parents.length;
  const arr = Object.values({ cl, ...parents });
  arr.unshift(arr.pop());
  return arr.flat();
});
