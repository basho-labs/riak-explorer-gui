import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

export default Ember.Route.extend(SideBarSelect, {
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
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    if (!model.get('isBucketListLoaded')) {
      controller.pollForModel(model, 3000);
    }
  }
});
