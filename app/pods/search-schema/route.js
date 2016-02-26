import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model(params) {
    return this.explorer.getSearchSchema(params.clusterName, params.searchSchemaName);
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      searchSchema: model
    });
    this.setViewLabel({
      preLabel: 'Search Schema',
      label: model.get('name')
    });
  }
});
