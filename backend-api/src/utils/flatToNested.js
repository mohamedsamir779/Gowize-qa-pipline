const { flattenChilds } = require('./flattenObject');

function checkLeftOvers(leftOvers, possibleParent) {
  for (let i = 0; i < leftOvers.length; i++) {
    if (leftOvers[i].parentId
      && leftOvers[i].parentId.toString() === possibleParent._id.toString()) {
      // delete leftOvers[i].parentId;
      // eslint-disable-next-line no-unused-expressions
      possibleParent.childs
        ? possibleParent.childs.push(leftOvers[i])
        : possibleParent.childs = [leftOvers[i]];
      possibleParent.count = possibleParent.childs.length;
      const addedObj = leftOvers.splice(i, 1);
      checkLeftOvers(leftOvers, addedObj[0]);
    }
  }
}

function findParent(possibleParents, possibleChild) {
  let found = false;
  for (let i = 0; i < possibleParents.length; i++) {
    if (possibleParents[i]._id.toString() === possibleChild.parentId.toString()) {
      found = true;
      // delete possibleChild.parentId;
      if (possibleParents[i].childs) possibleParents[i].childs.push(possibleChild);
      else possibleParents[i].childs = [possibleChild];
      possibleParents[i].count = possibleParents[i].childs.length;
      return true;
    }
    if (possibleParents[i].childs) found = findParent(possibleParents[i].childs, possibleChild);
  }
  return found;
}

module.exports.flatToNested = (client) => flattenChilds(client).flat()
  .reduce((initial, value, index, original) => {
    if (value.parentId === undefined) { // master IB has no parent
      if (initial.left.length) checkLeftOvers(initial.left, value);
      initial.nested.push(value);
    } else {
      const parentFound = findParent(initial.nested, value);
      if (parentFound) checkLeftOvers(initial.left, value);
      else initial.left.push(value);
    }
    return index < original.length - 1 ? initial : initial.nested;
  }, { nested: [], left: [] });
