export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isInteger(n) {
  return isNumber(n) && n === +n && n === (n|0);
}

export function isFloat(n) {
  return isNumber(n) && n === +n && (n !== (n|0) || (n === (n|0)));
}
