import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {
  model: function(params) {
    return this.explorer.getNode(params.clusterId, params.nodeId);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
  }
});
