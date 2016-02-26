import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    return this.explorer.getCluster(params.clusterName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs(null);
    this.setViewLabel(null);
  }
});
