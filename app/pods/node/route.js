import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    return this.explorer.getNode(params.clusterName, params.nodeName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      node: model
    });
    this.setViewLabel({
      preLabel: 'Node Detail',
      label: model.get('name')
    });
  }
});
