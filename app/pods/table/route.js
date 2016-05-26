import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {

  model: function(params) {
    return this.explorer.getTable(params.clusterName, params.tableName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      table: model
    });
    this.setViewLabel({
      preLabel: 'Table',
      label: model.get('name')
    });
  },

  startPollingForNewRowsList: function() {
    let self = this;

    this.set('timer', Ember.run.later(this, function() {
      self.lookForNewRowsList();
    }, 1000));
  },

  lookForNewRowsList: function() {
    let self = this;
    let table = this.currentModel;

    this.explorer.getTableRowsList(table)
      .then(function() {
        return self.explorer.getTableRows(table);
      })
      .then(function() {
        return Ember.run.cancel(self.get('timer'));
    });
  },

  actions: {
    refreshRowsList: function(table) {
      let self = this;

      return this.explorer.refreshTableRowsList(table).then(function() {
        self.startPollingForNewRowsList();
      });
    }
  }
});
