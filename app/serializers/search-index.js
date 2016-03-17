import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    let newPayload = {
      'search-indexes': payload
    };

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },

  // TODO: Remove once basho-labs/riak_explorer#89 is completed
  normalize(modelClass, resourceHash, prop) {
    resourceHash.schema_ref = resourceHash.schema;
    delete resourceHash.schema;

    return this._super(modelClass, resourceHash, prop);
  }
});
