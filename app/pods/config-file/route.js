import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {

  model: function(params) {
    return this.explorer.getConfigFile(params.clusterId, params.nodeId, params.configId);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('node').get('cluster'));
  }
});
