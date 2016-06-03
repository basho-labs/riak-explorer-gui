import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import Polling from '../../mixins/routes/polling';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, Polling, ScrollReset, WrapperState, {
  objectsPaging: {
    size: 10,
    initialLow: 0,
    initialHigh: 9
  },

  model: function(params) {
    return this.explorer.getBucket(params.clusterName, params.bucketTypeName, params.bucketName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      bucket: model
    });
    this.setViewLabel({
      preLabel: 'Bucket',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    let page = this.get('objectsPaging');

    this._super(controller, model);
    this.controller.set('pageSize', page.size);
    this.controller.set('currentObjects', this.objectsFromRange(page.initialLow, page.initialHigh));
  },

  objectsFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('objects').filter(function(bucket, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  lookForNewObjectsList: function() {
    let self = this;
    let bucket = this.currentModel;
    let page = this.get('objectsPaging');

    this.explorer.getObjectList(bucket)
      .then(function() {
        return self.explorer.getObjects(bucket);
      })
      .then(function() {
        self.controller.set('currentObjects', self.objectsFromRange(page.initialLow, page.initialHigh));
        self.stopPolling();
      });
  },

  actions: {
    deleteBucket: function(bucket) {
      let clusterName = bucket.get('bucketType').get('cluster').get('name');
      let bucketTypeName = bucket.get('bucketType').get('name');
      let self = this;

      bucket.destroyRecord().then(function() {
        self.transitionTo('bucket-type', clusterName, bucketTypeName);
      });
    },

    refreshObjectList: function(bucket) {
      let self = this;

      this.controller.set('modalVisible', false);
      this.controller.set('showCachedListWarning', false);

      return this.explorer.refreshObjectList(bucket).then(function() {
        self.startPolling(self.lookForNewObjectsList.bind(self));
      });
    },

    objectsPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentObjects', this.objectsFromRange(lowIndex, highIndex));
    }
  }
});
