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
  }
  //,

  //setupController: function(controller, model) {
  //  this._super(controller, model);
  //
  //  if (!model.get('isBucketListLoaded')) {
  //    controller.pollForModel(model, 3000);
  //  }
  //}
});
