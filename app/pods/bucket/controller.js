import Ember from 'ember';

var BucketController = Ember.Controller.extend({
    explorer: Ember.inject.service('explorer'),

    /**
     * Kicks off a model refresh after the specified delay.
     * Initially called by +BucketRoute.setupController+.
     *
     * @method pollForModel
     * @param bucket {Bucket}
     * @param delay {Number} Milliseconds to wait before refreshing the model
     *                       (to see if the key list has loaded)
     */
    pollForModel: function(bucket, delay) {
        var self = this;
        Ember.run.later(function() {
            self.refreshModel(bucket);
        }, delay);
    },

    /**
     * Reloads the model (a bucket, its properties and key list) from the server.
     * If the key list is not ready, try again after a delay.
     *
     * @method refreshModel
     * @param bucket {Bucket}
     */
    refreshModel: function(bucket) {
        var self = this;
        var cluster = bucket.get('cluster');
        self.get('explorer').getKeyList(bucket, self.store)
            .then(function(updatedKeyList) {
                // The key list could be either loaded or empty at this point
                bucket.set('keyList', updatedKeyList);
                // If the key list is empty/not-loaded, poll for it again
                if(!bucket.get('isKeyListLoaded') &&
                      updatedKeyList.get('cachePresent')) {
                    self.pollForModel(bucket, 3000);
                }
            });
    },

    actions: {
        retrieveRequestedKeys: function(startIndex) {
            let service = this.get('explorer');
            let bucket  = this.get('model');
            let store   = this.get('store');

            return service.getBucketWithKeyList(bucket, store, startIndex);
        },

        deleteBucket: function(bucket) {
            bucket.set('isKeyListLoaded', false);
            this.get('explorer').deleteBucket(bucket);
            // Reload the model after the delete, triggers a cache refresh
            this.pollForModel(bucket, 5000);
            // Reload the second time
            this.pollForModel(bucket, 10000);
        },

        refreshKeys: function(bucket) {
            var clusterId = bucket.get('clusterId');
            var bucketTypeId = bucket.get('bucketTypeId');
            var bucketId = bucket.get('bucketId');

            bucket.set('isKeyListLoaded', false);
            this.get('explorer').keyCacheRefresh(clusterId, bucketTypeId, bucketId);
            this.pollForModel(bucket, 3000);
        }
    }
});

export default BucketController;
