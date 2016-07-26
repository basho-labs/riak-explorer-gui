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

export function noWhiteSpace(string) {
  return !this.containsWhiteSpace(string);
}

export function isJsonParseable(string) {
  let isJSON;
  let stringWithSingleQuotesReplacedWithDouble = string.replace(/'/g, '"');

  try {
    isJSON = JSON.parse(stringWithSingleQuotesReplacedWithDouble);
  } catch(e) {
    throw new Error(`Invalid JSON, must be parseable. You can lint your JSON at <a href="http://jsonlint.com/" target="_blank">JSONLint</a>.`);
  }

  return isJSON;
}

// Resources (Cluster, BucketType, Bucket, Object)
export function hasName(resourceType, name) {
  let hasName = Ember.isPresent(name);

  if (!hasName) {
    throw new Error(`The ${resourceType} must be given a name.`);
  }

  return hasName;
}

export function noWhiteSpaceInName(resourceType, name) {
  let noWhiteSpace = this.noWhiteSpace(name);

  if (!noWhiteSpace) {
    throw new Error(`The ${resourceType} name can not contain any whitespace.`);
  }

  return noWhiteSpace;
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
      valid = this.objectHasCorrectValueType('Counter', key, value);
      break;
    case key.endsWith('_register'):
      valid = this.objectHasCorrectValueType('Register', key, value);
      break;
    case key.endsWith('_flag'):
      valid = this.objectHasCorrectValueType('Flag', key, value);
      break;
    case key.endsWith('_set'):
      valid = this.objectHasCorrectValueType('Set', key, value);
      break;
    case key.endsWith('_map'):
      valid = this.objectHasCorrectValueType('Map', key, value);
      break;
    default:
      valid = false;
      throw new Error(`The "${key}" property is not named correctly. The property must end with '_counter', '_register', '_flag', '_set', or '_map' based on the desired type.`);
  }

  return valid;
}

export function mapHasCorrectKeyNameEndingsAndValues(map) {
  let invalidKeys = Object.keys(map).filter(function(key) {
    return !this.mapKeyHasCorrectNameEndingAndValue(key, map[key]);
  });

  return Ember.isEmpty(invalidKeys);
}

// Set CRDT's
export function setHasCorrectValues(setName, array) {
  return Ember.isEmpty(array.filter(function(item) {
    let validItem = _.isString(item);

    if (!validItem) {
      throw new Error(`All items in the "${setName}" array must be string values`);
    }

    return !validItem; // Filter is finding non valid items, so remove any valid items
  }));
}

// CRDT's
export function objectHasCorrectValueType(type, objectName, value) {
  let valid;

  switch(type) {
    case 'Counter':
      valid = _.isNumber(value);
      break;
    case 'Register':
      valid = _.isString(value);
      break;
    case 'Flag':
      valid = _.isBoolean(value);
      break;
    case 'Set':
      valid = _.isArray(value) && this.setHasCorrectValues(objectName, value);
      break;
    case 'Map':
      valid = _.isPlainObject(value) && this.mapHasCorrectKeyNameEndingsAndValues(value);
      break;
    default:
      valid = _.isPlainObject(value);
      break;
  }

  if (!valid) { throw new Error(this.errorMessageForType(type, objectName)); }

  return valid;
}

export function errorMessageForType(type, objectName) {
  let message;

  switch(type) {
    case 'Counter':
      message = `The value of "${objectName}" must be a number.`;
      break;
    case 'Register':
      message = `The value of "${objectName}" must be a string.`;
      break;
    case 'Flag':
      message = `The value of "${objectName}" must be a boolean.`;
      break;
    case 'Set':
      message = `The value of "${objectName}" must be an array.`;
      break;
    case 'Map':
      message = `The value of "${objectName}" must be a javascript object.`;
      break;
    default:
      message = `The valye of "${objectName}" is incorrect, please check the input to make sure it is the correct type`;
  }

  return message;
}
