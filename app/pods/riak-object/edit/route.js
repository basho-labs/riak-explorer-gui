import Ember from 'ember';
import SideBarSelect from '../../../mixins/sidebar-select';

var RiakObjectEditRoute = Ember.Route.extend(SideBarSelect, {
  model: function(params) {
    var explorer = this.explorer;

    return explorer.getBucket(params.clusterId, params.bucketTypeId, params.bucketId)
      .then(function(bucket) {
        return explorer.getRiakObject(bucket, params.key);
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
  }
});

export default RiakObjectEditRoute;
