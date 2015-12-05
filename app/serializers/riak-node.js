import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    modelNameFromPayloadKey: function(payloadKey) {
        if (payloadKey === 'nodes') {
            payloadKey = 'riak-node';
        }

        return this._super(payloadKey);
    }
});
