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
  }
});
