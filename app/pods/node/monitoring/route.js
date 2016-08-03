import Ember from 'ember';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import Monitoring from '../../../mixins/routes/monitoring';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, Monitoring, ScrollReset, WrapperState, {
  model: function(params) {
    return this.explorer.getNode(params.clusterName, params.nodeName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      node: model,
      crudAction: 'monitoring'
    });
    this.setViewLabel({
      preLabel: 'Node Monitoring',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    this.setPossibleGraphOptions(model.get('stats'));
    this.setDefaultGraph();
  }
});
