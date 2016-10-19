import Ember from 'ember';

/**
 * View helper function used to display the amount of keys in the object.
 * 
 * @module ObjectLength
 */
export function objectLength(params) {
  let object = params[0];

  return Object.keys(object).length;
}

export default Ember.Helper.helper(objectLength);
