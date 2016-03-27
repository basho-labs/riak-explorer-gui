import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
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

    if (model.get('cluster').get('isEnterpriseEdition')) {
      return this.explorer.getNodeReplicationStatus(model);
    }
  }
});
