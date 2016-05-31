import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import Polling from '../../mixins/routes/polling';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, Polling, ScrollReset, WrapperState, {
  rowsPaging: {
    size: 10,
    initialLow: 0,
    initialHigh: 9
  },

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
    let page = this.get('rowsPaging');

    this._super(controller, model);
    this.controller.set('pageSize', page.size);
    this.controller.set('currentTableRows', this.rowsFromRange(page.initialLow, page.initialHigh));
  },

  rowsFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('rowsSortedByQuantumValues').filter(function(row, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  lookForNewRowsList: function() {
    let self = this;
    let table = this.currentModel;
    let page = this.get('rowsPaging');

    this.explorer.getTableRowsList(table)
      .then(function() {
        return self.explorer.getTableRows(table);
      })
      .then(function() {
        self.controller.set('currentTableRows', self.rowsFromRange(page.initialLow, page.initialHigh));
        self.stopPolling();
    });
  },

  actions: {
    refreshRowsList: function(table) {
      let self = this;

      this.controller.set('modalVisible', false);

      return this.explorer.refreshTableRowsList(table).then(function() {
        self.startPolling(self.lookForNewRowsList.bind(self));
      });
    },

    rowsPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentTableRows', this.rowsFromRange(lowIndex, highIndex));
    }
  }
});
