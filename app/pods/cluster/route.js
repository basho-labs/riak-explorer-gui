import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {
  actions: {
    error: function(errors, transition) {
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

  model: function(params) {
    return this.explorer.getCluster(params.clusterId, this.store);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.explorer.pingNodesInCluster(model, this.store);
  }
});
