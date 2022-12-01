interface Obj {
  [key: string]: any;
}

export default function checkTypeValidity(
  obj: Obj,
  allowedKeys: typeCheck
): boolean {
  if (typeof allowedKeys === 'undefined') {
    return true;
  }

  for (const key in obj) {
    const currentKey = key in allowedKeys ? key : key + '?';
    if (!(currentKey in allowedKeys)) return false;

    if (typeof allowedKeys[currentKey] === 'object') {
      if (!checkTypeValidity(obj[key], allowedKeys[currentKey] as typeCheck)) {
        return false;
      }
    } else if (typeof obj[key] !== allowedKeys[currentKey]) {
      return false;
    }
  }

  for (const key in allowedKeys) {
    if (!key.endsWith('?')) {
      if (!(key in obj)) {
        return false;
      }
    }
  }

  return true;
}
