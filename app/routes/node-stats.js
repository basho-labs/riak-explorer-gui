import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        nodeId: {
            refreshModel: true
        }
    },

    model: function(params) {
        return this.explorer.getNodeStats(params.nodeId);
    }
});
