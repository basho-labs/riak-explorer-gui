import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, ScrollReset, WrapperState, {
  pageSize: 5,

  model: function(params) {
    return this.explorer.getCluster(params.clusterName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model);
    this.setBreadCrumbs(null);
    this.setViewLabel(null);
    this.simulateLoad();
  },

  setupController: function(controller, model) {
    let lowIndex = 0;
    let highIndex = this.get('pageSize') - 1;

    this._super(controller, model);
    this.controller.set('pageSize', this.get('pageSize'));
    this.controller.set('currentPageTables', this.tablesFromRange(lowIndex, highIndex));
    this.controller.set('currentPageActiveBucketTypes', this.bucketTypesFromRange('active', lowIndex, highIndex));
    this.controller.set('currentPageInactiveBucketTypes', this.bucketTypesFromRange('inactive', lowIndex, highIndex));
    this.controller.set('currentPageIndexes', this.indexesFromRange(lowIndex, highIndex));
  },

  tablesFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('tables').filter(function(table, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  bucketTypesFromRange: function(type, startIndex, endIndex) {
    let filteredType = `${type}BucketTypes`;

    return this.currentModel.get(filteredType).filter(function(bucketType, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  indexesFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('searchIndexes').filter(function(searchIndex, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  actions: {
    tablePageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentPageTables', this.tablesFromRange(lowIndex, highIndex));
    },

    activeBucketTypesPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentPageActiveBucketTypes', this.bucketTypesFromRange('active', lowIndex, highIndex));
    },

    inactiveBucketTypesPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentPageInactiveBucketTypes', this.bucketTypesFromRange('inactive', lowIndex, highIndex));
    },

    indexPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentPageIndexes', this.indexesFromRange(lowIndex, highIndex));
    }
  }
});
