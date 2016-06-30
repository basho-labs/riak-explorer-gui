import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model: function(params) {
    let self = this;

    return this.explorer.getBucketType(params.clusterName, params.bucketTypeName).then(function(bucketType) {
      // Create both bucket and riak object
      let bucket = self.store.createRecord('bucket', {
        bucketType: bucketType,
        name: ''
      });

      let riakObject = self.store.createRecord('riak-object', {
        bucket: bucket,
        type: bucketType.get('dataTypeName')
      });

      return bucket;
    });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      crudAction: 'create bucket'
    });
    this.setViewLabel({
      preLabel: 'Create Bucket'
    });
  },

  serializeObjectContents: function(riakObject) {
    let type = riakObject.get('type');
    let content = riakObject.get('contents');
    let parsed;
    let serialized;

    // TODO: Make mixin
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // json parse error
    }

    switch(type) {
      case 'Map':
        serialized = {"update": parsed};
        break;
      case 'Set':
        serialized = {"add_all": parsed};
        break;
      case 'Counter':
        serialized = {"increment": parsed};
        break;
      case 'Default':
        serialized = parsed;
        break;
    }

    return serialized;
  },

  createCRDTBucket: function(bucket) {
    if (this.isValidCRDT(bucket)) {
      let self = this;
      let controller = this.controller;

      controller.set('errors', []);
      controller.set('spinnerMessage', 'Creating Bucket-Type ...');
      controller.set('showSpinner', true);

      let riakObject = bucket.get('objects').toArray()[0]; // TODO: This assumes only one object....
      let data = this.serializeObjectContents(riakObject);

      // TODO: Add create function that proxies update
      this.explorer.updateCRDT(riakObject, data)
        .then(function() {
          let bucketType = bucket.get('bucketType');

          // TODO: For bucket list, should actually be updating the existing cache list verses creating new, but need service created first
          return Ember.RSVP.allSettled([
            self.explorer.refreshObjectList(bucket),
            self.explorer.refreshBucketList(bucketType)
          ]);
        })
        .then(
          function onSuccess() {
            let clusterName = bucket.get('cluster').get('name');
            let bucketTypeName = bucket.get('bucketType').get('name');
            let bucketName = bucket.get('name');

            self.transitionTo('bucket', clusterName, bucketTypeName, bucketName);
          },
          function onFail() {
            controller.set('showSpinner', false);
            self.render('alerts.error-request-was-not-processed', {
              into: 'application',
              outlet: 'alert'
            });
          }
      );
    }
  },

  createDefaultBucket: function(bucket) {

  },

  // TODO: Add validations
  isValidDefault: function(bucket) {
    // Needs to validate that it is json parseable
    return true;
  },

  // TODO: Add validations
  isValidCRDT: function(bucket) {
    // needs to validate based on the type
    return true;
  },

  actions: {
    willTransition: function() {
      //let bucket = this.currentModel;
      //bucket.get('objects').forEach(function(obj) { obj.destroyRecord(); });
      //bucket.destroyRecord();
    },

    didTransition: function() {
      return this.controller.set('showSpinner', false);
    },

    createBucket: function() {
      let bucket = this.currentModel;

      return (bucket.get('bucketType').get('isCRDT')) ? this.createCRDTBucket(bucket) : this.createDefaultBucket(bucket);
    }
  }
});
