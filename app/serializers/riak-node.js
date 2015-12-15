import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    modelNameFromPayloadKey: function(payloadKey) {
        if (payloadKey === 'nodes') {
            payloadKey = 'riak-nodes';
        }

        return this._super(payloadKey);
    }
});
