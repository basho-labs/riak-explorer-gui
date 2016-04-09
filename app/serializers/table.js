import ApplicationSerializer from './application';
import Ember from 'ember';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let sortBy = Ember.Enumerable.sortBy;

    payload.tables = payload.tables.sortBy('name');

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
