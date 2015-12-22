import Ember from 'ember';
import SideBarSelect from '../../mixins/sidebar-select';

var RiakObjectRoute = Ember.Route.extend(SideBarSelect, {
  actions: {
    error: function(error, transition) {
      if (error && error.status === 404) {
        transition.queryParams = transition.params['riak-object'];
        this.transitionTo('error.object-not-found', transition);
      } else {
        // Unknown error, bubble error event up to routes/application.js
        return true;
      }
    }
  },

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
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    if (!model.get('isLoaded')) {
      this.explorer.getRiakObject(model.get('bucket'),
        model.get('key'), this.store)
        .then(function(object) {
          controller.set('model', object);
        });
    }
  }
});

export default RiakObjectRoute;
