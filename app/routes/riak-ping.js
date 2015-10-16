import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        node_id: {
            refreshModel: true
        }
    },

    model: function(params) {
        return this.explorer.getNodePing(params.node_id);
    }
});
