import Ember from 'ember';

var BucketTypeController = Ember.Controller.extend({
  explorer: Ember.inject.service('explorer'),

  /**
   * Kicks off a model refresh after the specified delay.
   * Initially called by +BucketTypeRoute.setupController+.
   *
   * @method pollForModel
   * @param bucketType {BucketType}
   * @param delay {Number} Milliseconds to wait before refreshing the model
   *                       (to see if the bucket list has loaded)
   */
  pollForModel: function(bucketType, delay) {
    var self = this;

    Ember.run.later(function() {
      // console.log('controller: scheduling to refreshModel');
      self.refreshModel(bucketType);
    }, delay);
  },

  /**
   * Reloads the model (bucket type, its properties and bucket list)
   * from the server.
   * If the bucket list is not ready, try again after a delay.
   *
   * @method refreshModel
   * @param bucketType {BucketType}
   */
  refreshModel: function(bucketType) {
    var self = this;

    // console.log("Refreshing model %O", bucketType);
    var cluster = bucketType.get('cluster');

    self.get('explorer').getBucketList(cluster, bucketType)
      .then(function(updatedBucketList) {
        // console.log('loaded bucket list: %O', updatedBucketList);
        var model = self.get('model');

        model.set('bucketList', updatedBucketList);

        if (!model.get('isBucketListLoaded') &&
          updatedBucketList.get('cachePresent')) {

          // Only continue polling in development mode
          self.pollForModel(model, 3000);
        }
      });
  },

  actions: {
    retrieveRequestedBuckets: function(startIndex) {
      let service = this.get('explorer');
      let bucketType = this.get('model');
      let cluster = bucketType.get('cluster');

      return service.getBucketTypeWithBucketList(bucketType, cluster, startIndex);
    },

    refreshBuckets: function(bucketType) {
      var clusterId = bucketType.get('clusterId');
      var bucketTypeId = bucketType.get('bucketTypeId');

      this.get('model').set('isBucketListLoaded', false);
      this.get('explorer').bucketCacheRefresh(clusterId, bucketTypeId);
      this.pollForModel(this.get('model'), 3000);
    }
  }
});

export default BucketTypeController;
