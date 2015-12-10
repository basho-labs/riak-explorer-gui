import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        error: function (errors, transition) {
            let error = errors.errors[0];

            if (error && error.status === "404") {
                this.transitionTo(
                    'error.cluster-not-found',
                    {queryParams: {cluster_id: transition.params.cluster_id}}
                );
            } else {
                // Unknown error, bubble error event up to routes/application.js
                return true;
            }
        }
    },

    model: function (params) {
        return this.store.findRecord('cluster', params.cluster_id);
    },

    afterModel: function (model, transition) {
        return Ember.RSVP.allSettled([
            this.setBuckets(model),
            this.getIndexes(model),
            this.pingNodes(model)
        ]);
    },

    getIndexes: function (cluster) {
        let clusterId = cluster.get('id');

        return  this.store.query('search-index', { clusterId: clusterId });
    },

    pingNodes: function(cluster) {
        let self = this;

        return cluster.get('riakNodes').then(function(riakNodes) {
            riakNodes.forEach(function (node) {
                let nodeId = node.get('id');

                self.explorer.getNodePing(nodeId).then(function onSuccess(data) {
                    node.set('available', true);
                }, function onFail(data) {
                    node.set('available', false);
                });
            });
        });
    },

    // TODO: Eventually move this over to be handled by Ember Data
    setBuckets: function (cluster) {
        let clusterId = cluster.get('id');

        return this.store.query('bucket-type', {clusterId: clusterId}).then(function(bucket) {
            cluster.set('bucketTypes', bucket);
        });
    }
});
