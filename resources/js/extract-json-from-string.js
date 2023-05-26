/**
 * @type {{'[': string, '{': string}}
 */
const chars = {
  '[': ']',
  '{': '}',
};

/**
 * @param almostJson
 * @return {any}
 */
const jsonify = (almostJson) => {
  try {
    return JSON.parse(almostJson);
  } catch (e) {
    almostJson = almostJson.replace(/([a-zA-Z0-9_$]+\s*):/g, '"$1":').replace(/'([^']+?)'([\s,\]}])/g, '"$1"$2');
    return JSON.parse(almostJson);
  }
};

/**
 * @param iterate
 * @param iterator
 * @return {*}
 */
const any = (iterate, iterator) => {
  let result;
  for (let i = 0; i < iterate.length; i++) {
    result = iterator(iterate[i], i, iterate);
    if (result) {
      break;
    }
  }
  return result;
};

/**
 * @param str
 * @return {string|null}
 */
const extract = (str) => {
  let startIndex = str.search(/[{\[]/);
  if (startIndex === -1) {
    return null;
  }

  let openingChar = str[startIndex];
  let closingChar = chars[openingChar];
  let endIndex = -1;
  let count = 0;

  str = str.substring(startIndex);
  any(str, (letter, i) => {
    if (letter === openingChar) {
      count++;
    } else if (letter === closingChar) {
      count--;
    }

    if (!count) {
      endIndex = i;
      return true;
    }
  });

  if (endIndex === -1) {
    return null;
  }

  return str.substring(0, endIndex + 1);
};

/**
 * @param str
 * @return {*[]}
 */
export const extractJsonFromString = (str) => {
  let result;
  const objects = [];
  while ((result = extract(str)) !== null) {
    let obj = jsonify(result);
    objects.push(obj);
    str = str.replace(result, '');
  }

  return objects;
};
