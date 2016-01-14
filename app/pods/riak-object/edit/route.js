import Ember from 'ember';
import WrapperState from '../../../mixins/wrapper-state';

var RiakObjectEditRoute = Ember.Route.extend(WrapperState, {
  model: function(params) {
    var explorer = this.explorer;

    return explorer.getBucket(params.clusterId, params.bucketTypeId, params.bucketId)
      .then(function(bucket) {
        return explorer.getRiakObject(bucket, params.key);
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      bucket: model.get('bucket'),
      riakObject: model
    });
  }
});

export default RiakObjectEditRoute;
