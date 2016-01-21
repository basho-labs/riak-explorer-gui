import Ember from 'ember';
import WrapperState from '../../mixins/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    return this.explorer.getCluster(params.clusterId)
      .then(function(cluster) {
        return cluster.get('searchIndexes').findBy('name', params.searchIndexId);
      });
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
