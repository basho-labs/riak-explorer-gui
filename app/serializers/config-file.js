import ApplicationSerializer from './application';
import Ember from 'ember';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    let newPayload = {
      'config-files': payload.files
    };

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }
});
