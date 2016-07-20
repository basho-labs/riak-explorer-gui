import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';
import Validations from '../../../utils/validations';
import Formatter from '../../../utils/riak-object-formatter';
import _ from 'lodash/lodash';

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

  bucketsFirstObject: function(bucket) {
    return _.head(bucket.get('objects').toArray());
  },

  actions: {
    willTransition: function() {
      let bucket = this.currentModel;
      let object = this.bucketsFirstObject(bucket);

      // Order of removal matters here, as object dependencies are looked up during the removal process
      object.destroyRecord().then(function() {
        bucket.destroyRecord();
      });
    },

    didTransition: function() {
      this.controller.set('errors', []);
      this.controller.set('showSpinner', false);
    },

    createBucket: function() {
      let self = this;
      let controller = this.controller;
      let bucket = this.currentModel;
      let riakObject = this.bucketsFirstObject(bucket);
      let clusterName = bucket.get('cluster').get('name');
      let bucketType = bucket.get('bucketType');
      let bucketTypeName = bucketType.get('name');
      let bucketName = bucket.get('name');
      let objectName = riakObject.get('name');

      controller.set('errors', []);

      if (this.isValid(bucket, riakObject)) {
        let contents = riakObject.set('contents', Validations.isJsonParseable(riakObject.get('contents'))); // set contents of the object as the JSON parsed version;
        let serializedData = Formatter.formatRiakObject(riakObject.get('type'), contents);
        let createBucket = bucketType.get('isCRDT') ?
          _.partial(this.explorer.createCRDT, clusterName, bucketTypeName, bucketName, objectName, serializedData) :
          _.bind(riakObject.save, riakObject);

        controller.set('spinnerMessage', 'Creating Bucket-Type ...');
        controller.set('showSpinner', true);

        // createBucket()
        createBucket()
          .then(function() {
            return Ember.RSVP.allSettled([
              self.explorer.refreshBucketList(bucketType),
              self.explorer.refreshObjectList(bucket)
            ]);
          })
          .then(
            function onSuccess() {
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
