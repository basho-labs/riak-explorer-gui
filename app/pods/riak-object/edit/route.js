import Ember from 'ember';
import SideBarSelect from '../../../mixins/sidebar-select';

var RiakObjectEditRoute = Ember.Route.extend(SideBarSelect, {
  model: function(params) {
    var explorer = this.explorer;
    var store = this.store;

    return explorer.getBucket(params.clusterId,
      params.bucketTypeId, params.bucketId, store)
      .then(function(bucket) {
        return explorer.getRiakObject(bucket, params.key, store);
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
  }
});

export default RiakObjectEditRoute;
