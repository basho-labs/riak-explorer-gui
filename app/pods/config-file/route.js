import Ember from 'ember';
import WrapperState from '../../mixins/wrapper-state';

export default Ember.Route.extend(WrapperState, {

  model: function(params) {
    return this.explorer.getConfigFile(params.clusterId, params.nodeId, params.configId);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('node').get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('node').get('cluster'),
      node: model.get('node'),
      configFile: model
    });
    this.setViewLabel({
      preLabel: 'Config Detail',
      label: model.get('fileId')
    });
  }
});
