import Ember from 'ember';
import WrapperState from '../../../mixins/routes/wrapper-state';

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
    this.setViewLabel({
      preLabel: 'Riak Object',
      label: model.get('key')
    });
  }
});

export default RiakObjectEditRoute;
