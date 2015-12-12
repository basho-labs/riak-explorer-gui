import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        let newPayload = {
          'search-indexes': payload
        };

        return this._super(store, primaryModelClass, newPayload, id, requestType);
    }
});
