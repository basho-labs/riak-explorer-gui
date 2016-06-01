import Ember from 'ember';
import LoadingSlider from '../../mixins/routes/loading-slider';
import Polling from '../../mixins/routes/polling';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(LoadingSlider, Polling, ScrollReset, WrapperState, {
  bucketsPaging: {
    size: 10,
    initialLow: 0,
    initialHigh: 9
  },

  model: function(params) {
    return this.explorer.getBucketType(params.clusterName, params.bucketTypeName);
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model
    });
    this.setViewLabel({
      preLabel: 'Bucket Type',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    let page = this.get('bucketsPaging');

    this._super(controller, model);
    this.controller.set('pageSize', page.size);
    this.controller.set('currentBuckets', this.bucketsFromRange(page.initialLow, page.initialHigh));
  },

  bucketsFromRange: function(startIndex, endIndex) {
    return this.currentModel.get('buckets').filter(function(bucket, index) {
      return index >= startIndex && index <= endIndex;
    });
  },

  lookForNewBucketsList: function() {
    let self = this;
    let bucketType = this.currentModel;
    let page = this.get('bucketsPaging');

    this.explorer.getBucketList(bucketType)
      .then(function(list) {
        return self.explorer.getBuckets(bucketType);
      })
      .then(function(buckets) {
        self.controller.set('currentBuckets', self.bucketsFromRange(page.initialLow, page.initialHigh));
        self.stopPolling();
      });
  },

  actions: {
    refreshBucketList: function(bucketType) {
      let self = this;

      this.controller.set('modalVisible', false);
      this.controller.set('showCachedListWarning', false);

      return this.explorer.refreshBucketList(bucketType).then(function() {
        self.startPolling(self.lookForNewBucketsList.bind(self));
      });
    },

    bucketsPageRequest: function(lowIndex, highIndex) {
      this.controller.set('currentBuckets', this.bucketsFromRange(lowIndex, highIndex));
    }
  }
});
