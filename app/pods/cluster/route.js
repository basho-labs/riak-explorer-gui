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
        return this.explorer.getCluster(params.cluster_id, this.store);
    },

    afterModel: function (model, transition) {
        return this.pingNodes(model);
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
    }
});
