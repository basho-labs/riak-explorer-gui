import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize: function(modelClass, resourceHash, prop) {
        resourceHash.links = {
            'riakNodes': 'nodes',
            'searchIndexes': `/riak/clusters/${resourceHash.id}/search/index`
        };

        return this._super(modelClass, resourceHash, prop);
    }
});
