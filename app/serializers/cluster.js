import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(modelClass, resourceHash, prop) {
        resourceHash.links = {
            'riakNodes': 'nodes'
        };

        return this._super(modelClass, resourceHash, prop);
    }
});
