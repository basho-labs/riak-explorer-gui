import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

var RiakObjectRoute = Ember.Route.extend(WrapperState, {
  model: function(params) {
    return this.explorer.getObject(params.clusterName, params.bucketTypeName, params.bucketName, params.objectName);
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
      label: model.get('name')
    });
  }

  //actions: {
  //  error: function(error, transition) {
  //    if (error && error.status === 404) {
  //      transition.queryParams = transition.params['riak-object'];
  //      this.transitionTo('error.object-not-found', transition);
  //    } else {
  //      // Unknown error, bubble error event up to routes/application.js
  //      return true;
  //    }
  //  },
  //
  //  deleteObject: function(object) {
  //    this.get('explorer').deleteObject(object);
  //    this.get('explorer').markDeletedKey(object);
  //
  //    // Once the delete has been issued,
  //    // return to the bucket's Key List view.
  //    this.transitionTo('bucket', object.get('bucket'));
  //  }
  //},
});

export default RiakObjectRoute;
