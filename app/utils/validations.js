import Ember from 'ember';
import _ from 'lodash/lodash';

export function isUniqueArrayItem(array, item) {
  return Ember.isPresent(item) && _.indexOf(array, item) === -1;
}

export function  itemExistsInArray(array, item) {
  return _.indexOf(array, item) > -1;
}
