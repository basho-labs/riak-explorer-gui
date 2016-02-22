import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';
import LoadingSlider from '../../mixins/routes/loading-slider';

export default Ember.Route.extend(WrapperState, LoadingSlider, {
  model: function(params) {
    return this.explorer.getCluster(params.clusterName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs(null);
    this.setViewLabel(null);
    this.simulateLoad();
  }
});
