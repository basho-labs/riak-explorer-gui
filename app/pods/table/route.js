import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  pageSize: 10,

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

  setupController: function(controller, model) {
    let lowIndex = 0;
    let highIndex = this.get('pageSize') - 1;

    this._super(controller, model);
    this.controller.set('pageSize', this.get('pageSize'));
    this.controller.set('currentTableRows', this.rowsFromRange(lowIndex, highIndex));
  },

  rowsFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('rowsSortedByQuantumValues').filter(function(row, index) {
      return index >= startIndex && index <= endIndex;
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
        let lowIndex = 0;
        let highIndex = self.get('pageSize') - 1;

        self.controller.set('currentTableRows', this.rowsFromRange(lowIndex, highIndex));
        return Ember.run.cancel(self.get('timer'));
    });
  },

  actions: {
    refreshRowsList: function(table) {
      let self = this;

      this.controller.set('modalVisible', false);

      return this.explorer.refreshTableRowsList(table).then(function() {
        self.startPollingForNewRowsList();
      });
    },

    rowsPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentTableRows', this.rowsFromRange(lowIndex, highIndex));
    }
  }
});
