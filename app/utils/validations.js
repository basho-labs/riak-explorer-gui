import Ember from 'ember';
import _ from 'lodash/lodash';

// Arrays
export function isUniqueArrayItem(array, item) {
  return Ember.isPresent(item) && _.indexOf(array, item) === -1;
}

export function itemExistsInArray(array, item) {
  return _.indexOf(array, item) > -1;
}


// Strings
export function containsWhiteSpace(string) {
  return string.indexOf(' ') >= 0;
}

export function isJsonParseable(string) {
  let isJSON;

  try {
    isJSON = JSON.parse(string);
  } catch(e) {
    throw new Error(`Invalid JSON, must be parseable. Make sure to wrap any keys in double quotes. You can use a linter at <a href="http://jsonlint.com/" target="_blank">JSONLint</a>.`);
  }

  return isJSON;
}


// Objects
export function isObject(data) {
  let isObject = _.isPlainObject(data);

  if (!isObject) {
    throw new Error(`Data provided is not a javascript object.`);
  }

  return isObject;
}


// Map CRDTs
export function mapKeyHasCorrectNameEndingAndValue(key, value) {
  let valid;

  switch(true) {
    case key.endsWith('_counter'):
      valid = _.isNumber(value);
      if (!valid) { throw new Error(`The value of "${key}" must be a number.`); }
      break;
    case key.endsWith('_register'):
      valid = _.isString(value);
      if (!valid) { throw new Error(`The value of "${key}" must be a string.`); }
      break;
    case key.endsWith('_flag'):
      valid = _.isBoolean(value);
      if (!valid) { throw new Error(`The value of "${key}" must be a boolean.`); }
      break;
    case key.endsWith('_set'):
      valid = _.isArray(value);
      if (!valid) { throw new Error(`The value of "${key}" must be an array.`); }
      break;
    case key.endsWith('_map'):
      valid = _.isPlainObject(value);
      if (!valid) { throw new Error(`The value of "${key}" must be a javascript object.`); }
      break;
    default:
      valid = false;
      throw new Error(`The "${key}" property is not named correctly. The property must end with '_counter', '_register', '_flag', '_set', or '_map' based on the desired type.`);
  }

  return valid;
}

export function mapHasCorrectKeyNameEndingsAndValues(map) {
  let invalidKeys = Object.keys(map).filter(function(key) {
    return !mapKeyHasCorrectNameEndingAndValue(key, map[key]);
  });

  return Ember.isEmpty(invalidKeys);
}
