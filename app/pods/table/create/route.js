import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('table', { cluster: cluster });
    });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      tableCreate: true
    });
    this.setViewLabel({
      preLabel: 'Create Table'
    });
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('errors', []);
  },

  actions: {
    onTableCreate: function(tableName) {
      let cluster = this.currentModel;

      this.transitionTo('table', cluster.get('name'), tableName);
    }
  }
});
