export function createDimArr(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createDimArr.apply(this, args);
  }

  return arr;
}
export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
