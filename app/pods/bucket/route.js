import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
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
      label: model.get('bucketId')
    });
  },

  actions: {
    //retrieveRequestedKeys: function(startIndex) {
    //  let service = this.get('explorer');
    //  let bucket = this.get('model');
    //
    //  return service.getBucketWithKeyList(bucket, startIndex);
    //},

    //deleteObjects: function(bucket) {
    //  let self = this;
    //
    //  bucket.set('isListLoaded', false);
    //  this.explorer.deleteObjectsInList(bucket);
    //},

    refreshObjects: function(bucket) {
      let self = this;

      bucket.set('isListLoaded', false);
      bucket.set('statusMessage', 'Refreshing from a streaming list keys call...');

      bucket.get('objectList')
        .then(function(item) {
          return item.destroyRecord()
        })
        .then(function() {
          self.explorer.refreshObjectList(bucket);
        })
        .then(function() {
          self.explorer.getObjectList(bucket);
          self.explorer.getObjects(bucket);
      });
    }
  }
});
