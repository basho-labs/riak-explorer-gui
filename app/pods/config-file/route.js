import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';
import LoadingSlider from '../../mixins/routes/loading-slider';

export default Ember.Route.extend(WrapperState, LoadingSlider, {

  model: function(params) {
    return this.explorer.getConfigFile(params.clusterName, params.nodeName, params.configName);
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
      label: model.get('name')
    });
  }
});
