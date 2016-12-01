import Ember from 'ember';
import _ from 'lodash/lodash';

const Validations = {
  // Arrays
  isUniqueArrayItem(array, item) {
    return Ember.isPresent(item) && _.indexOf(array, item) === -1;
  },

  itemExistsInArray(array, item) {
    return _.indexOf(array, item) > -1;
  },

  // Strings
  containsWhiteSpace(string) {
    return string.indexOf(' ') >= 0;
  },

  noWhiteSpace(string) {
    return !Validations.containsWhiteSpace(string);
  },

  isJsonParseable(string) {
    let isJSON;
    let stringWithSingleQuotesReplacedWithDouble = string.replace(/'/g, '"');

    try {
      isJSON = JSON.parse(stringWithSingleQuotesReplacedWithDouble);
    } catch(e) {
      throw new Error(`Invalid JSON, must be parseable. You can lint your JSON at <a href="http://jsonlint.com/" target="_blank">JSONLint</a>.`);
    }

    return isJSON;
  },

  // Resources (Cluster, BucketType, Bucket, Object)
  hasName(resourceType, name) {
    let hasName = Ember.isPresent(name);

    if (!hasName) {
      throw new Error(`The ${resourceType} must be given a name.`);
    }

    return hasName;
  },

  noWhiteSpaceInName(resourceType, name) {
    let noWhiteSpace = Validations.noWhiteSpace(name);

    if (!noWhiteSpace) {
      throw new Error(`The ${resourceType} name can not contain any whitespace.`);
    }

    return noWhiteSpace;
  },

  // Objects
  isObject(data) {
    let isObject = _.isPlainObject(data);

    if (!isObject) {
      throw new Error(`Data provided is not a javascript object.`);
    }

    return isObject;
  },

  // Map CRDTs
  mapKeyHasCorrectNameEndingAndValue(key, value) {
    let objectHasCorrectValue = Validations.objectHasCorrectValueType;
    let valid;

    switch(true) {
      case key.endsWith('_counter'):
        valid = objectHasCorrectValue('Counter', key, value);
        break;
      case key.endsWith('_register'):
        valid = objectHasCorrectValue('Register', key, value);
        break;
      case key.endsWith('_flag'):
        valid = objectHasCorrectValue('Flag', key, value);
        break;
      case key.endsWith('_set'):
        valid = objectHasCorrectValue('Set', key, value);
        break;
      case key.endsWith('_map'):
        valid = objectHasCorrectValue('Map', key, value);
        break;
      default:
        valid = false;
        throw new Error(`The "${key}" property is not named correctly. The property must end with '_counter', '_register', '_flag', '_set', or '_map' based on the desired type.`);
    }

    return valid;
  },

  mapHasCorrectKeyNameEndingsAndValues(map) {
    let hasCorrectEnding = Validations.mapKeyHasCorrectNameEndingAndValue;

    let invalidKeys = Object.keys(map).filter(function(key) {
      return !hasCorrectEnding(key, map[key]);
    });

    return Ember.isEmpty(invalidKeys);
  },

  // Set CRDT's
  setHasCorrectValues(setName, array) {
    return Ember.isEmpty(array.filter(function(item) {
      let validItem = _.isString(item);

      if (!validItem) {
        throw new Error(`All items in the "${setName}" array must be string values`);
      }

      return !validItem; // Filter is finding non valid items, so remove any valid items
    }));
  },

  // CRDT's
  objectHasCorrectValueType(type, objectName, value) {
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
      case 'HyperLogLog':
        valid = _.isArray(value) && Validations.setHasCorrectValues(objectName, value);
        break;
      case 'Map':
        valid = _.isPlainObject(value) && Validations.mapHasCorrectKeyNameEndingsAndValues(value);
        break;
      default:
        valid = _.isPlainObject(value);
        break;
    }

    if (!valid) { throw new Error(Validations.errorMessageForType(type, objectName)); }

    return valid;
  },

  errorMessageForType(type, objectName) {
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
        message = `The value of "${objectName}" is incorrect, please check the input to make sure it is the correct type`;
    }

    return message;
  }
};

export default Validations;








