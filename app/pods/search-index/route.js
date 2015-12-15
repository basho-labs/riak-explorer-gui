import Ember from 'ember';

export default Ember.Route.extend({
    model: function (params) {
        return this.explorer.getCluster(params.clusterId, this.store)
            .then(function(cluster){
                return cluster.get('searchIndexes').findBy('name', params.searchIndexId);
            });
    }
});
