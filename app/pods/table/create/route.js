import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  errors: ['some error'],

  model: function(params) {
    return this.explorer.getCluster(params.clusterName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs({
      cluster: model,
      tableCreate: true
    });
    this.setViewLabel({
      preLabel: 'Create Table'
    });
    this.simulateLoad();
  },

  actions: {
    onTableCreate: function(tableName) {
      let cluster = this.currentModel;

      this.transitionTo('table', cluster.get('name'), tableName);
    }
  }
});
