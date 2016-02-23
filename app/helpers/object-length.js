import Ember from 'ember';

export function objectLength(params) {
  let object = params[0];

  return Object.keys(object).length;
}

export default Ember.Helper.helper(objectLength);
