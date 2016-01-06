import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {
  model: function(params) {
    return this.explorer.getCluster(params.clusterId)
      .then(function(cluster) {
        return cluster.get('searchIndexes').findBy('name', params.searchIndexId);
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
  }
});
