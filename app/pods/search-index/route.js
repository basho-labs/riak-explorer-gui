import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    return this.explorer.getIndex(params.clusterName, params.searchIndexName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      searchIndex: model
    });
    this.setViewLabel({
      preLabel: 'Search Index',
      label: model.get('name')
    });
  }
});
