import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
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
      preLabel: 'Bucket-Type',
      label: model.get('bucketTypeId')
    });
  },

  actions: {
    //retrieveRequestedBuckets: function(startIndex) {
    //  let service = this.get('explorer');
    //  let bucketType = this.get('model');
    //  let cluster = bucketType.get('cluster');
    //
    //  return service.getBucketTypeWithBucketList(bucketType, cluster, startIndex);
    //},

    refreshBuckets: function(bucketType) {
      bucketType.set('isListLoaded', false);
      bucketType.set('statusMessage', 'Refreshing from a streaming list buckets call...');

      this.explorer.refreshBucketList(bucketType);
    }
  }
});
