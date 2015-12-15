import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        var clusterId = params.clusterId;
        var bucketTypeId = params.bucketTypeId;
        var explorer = this.explorer;
        var store = this.store;

        return this.explorer
          .getBucketType(clusterId, bucketTypeId, store)
          .then(function(bucketType) {
              return explorer.getBucketTypeWithBucketList(bucketType, bucketType.get('cluster'), store);
          });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        if(!model.get('bucketList')) {
            // Init to empty bucket list
            let buckets = null;
            let emptyList = this.explorer.createBucketList(buckets, model.get('cluster'),
                model.get('bucketType'), this.store);
            model.set('bucketList', emptyList);
        }
        if(!model.get('isBucketListLoaded')) {
            controller.pollForModel(model, 3000);
        }
    }
});
