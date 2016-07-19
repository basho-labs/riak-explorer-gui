import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import Validations from '../../../utils/validations';
import Formatter from '../../../utils/riak-object-formatter';
import _ from 'lodash/lodash';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  firstObjectRef: null,

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

      // Save a reference to this object as we need it in other instances
      self.set('firstObjectRef', riakObject);

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

  isValidBucket: function(bucket) {
    let bucketName = bucket.get('name');

    return Validations.hasName('bucket', bucketName) &&
           Validations.noWhiteSpaceInName('bucket', bucketName);
  },

  isValidObject: function(object) {
    let objectType = object.get('type');
    let objectName = object.get('name');

    return Validations.hasName('buckets object', objectName) &&
           Validations.noWhiteSpaceInName('buckets object', objectName) &&
           Validations.objectHasCorrectValueType(objectType, objectName, Validations.isJsonParseable(object.get('contents')));
  },

  isValid: function(bucket, object) {
    let isValid;

    try {
      isValid = this.isValidBucket(bucket) && this.isValidObject(object);
    } catch(e) {
      this.controller.get('errors').pushObject(e.message);
      this.scrollToTop();
    }

    return isValid;
  },

  actions: {
    willTransition: function() {
      let bucket = this.currentModel;
      let object = this.get('firstObjectRef');

      bucket.destroyRecord();
      object.destroyRecord();
    },

    didTransition: function() {
      this.controller.set('errors', []);
      this.controller.set('showSpinner', false);
    },

    createBucket: function() {
      let self = this;
      let controller = this.controller;
      let bucket = this.currentModel;
      let riakObject = this.get('firstObjectRef');

      controller.set('errors', []);

      if (this.isValid(bucket, riakObject)) {
        let JSON = Validations.isJsonParseable(riakObject.get('contents'));
        let serializedData = Formatter.formatRiakObject(riakObject.get('type'), JSON);
        let createBucket = bucket.get('bucketType').get('isCRDT') ? _.partial(this.explorer.updateCRDT, riakObject, serializedData) : _.partial(riakObject.save);

        controller.set('spinnerMessage', 'Creating Bucket-Type ...');
        controller.set('showSpinner', true);

        // TODO: Add create function that proxies update
        createBucket()
          .then(function() {
            let bucketType = bucket.get('bucketType');

            return Ember.RSVP.allSettled([
              self.explorer.refreshBucketList(bucketType),
              self.explorer.refreshObjectList(bucket)
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
              // TODO: Don't use template
              self.render('alerts.error-request-was-not-processed', {
                into: 'application',
                outlet: 'alert'
              });
            }
          );
      }
    }
  }
});
