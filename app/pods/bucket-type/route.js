import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    var clusterId = params.clusterId;
    var bucketTypeId = params.bucketTypeId;
    var explorer = this.explorer;

    return this.explorer
      .getBucketType(clusterId, bucketTypeId)
      .then(function(bucketType) {
        return explorer.getBucketTypeWithBucketList(bucketType, bucketType.get('cluster'));
      });
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

  setupController: function(controller, model) {
    this._super(controller, model);

    if (!model.get('isBucketListLoaded')) {
      controller.pollForModel(model, 3000);
    }
  }
});
