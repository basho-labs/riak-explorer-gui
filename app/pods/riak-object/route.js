import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

var RiakObjectRoute = Ember.Route.extend(WrapperState, {
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
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    if (!model.get('isLoaded')) {
      this.explorer.getRiakObject(model.get('bucket'), model.get('key'))
        .then(function(object) {
          controller.set('model', object);
        });
    }
  }
});

export default RiakObjectRoute;
