import Ember from 'ember';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(WrapperState, {
  model: function(params) {
    let explorer = this.explorer;

    return explorer
      .getBucket(params.clusterId, params.bucketTypeId, params.bucketId)
      .then(function(bucket) {
        return explorer.getBucketWithKeyList(bucket);
      });
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
  },

  /**
   * @method setupController
   * @param controller {BucketController}
   * @param model {Bucket}
   */
  setupController: function(controller, model) {
    this._super(controller, model);
    // When user follows a bucket link from the Bucket Type view,
    //   the props are not yet initialized. Also, the model()
    //   function, above, is not called. Handle this case.
    if (Ember.isEmpty(model.get('props'))) {
      this.explorer
        .getBucketProps(model.get('clusterId'), model.get('bucketTypeId'), model.get('bucketId'))
        .then(function(bucketProps) {
          model.set('props', bucketProps);
        });
    }
    // Start fetching the key list
    if (!model.get('isKeyListLoaded')) {
      controller.pollForModel(model, 3000);
    }
  }
});
