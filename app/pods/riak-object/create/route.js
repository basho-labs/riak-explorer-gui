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

    return this.explorer.getBucket(params.clusterName, params.bucketTypeName, params.bucketName)
      .then(function(bucket) {
        return self.store.createRecord('riak-object', {
          bucket: bucket,
          type: bucket.get('dataTypeName')
        });
      });
  },

  afterModel: function(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      bucketType: model.get('bucketType'),
      bucket: model.get('bucket'),
      crudAction: 'create'
    });
    this.setViewLabel({
      preLabel: 'New Object',
    });
  },

  isValid: function(object) {
    let isValid;

    try {
      let objectType = object.get('type');
      let objectName = object.get('name');

      isValid = Validations.hasName('buckets object', objectName) &&
                Validations.noWhiteSpaceInName('buckets object', objectName) &&
                Validations.objectHasCorrectValueType(objectType, objectName, Validations.isJsonParseable(object.get('contents')));
    } catch(e) {
      this.controller.get('errors').pushObject(e.message);
      this.scrollToTop();
    }

    return isValid;
  },

  actions: {
    didTransition: function() {
      this.controller.set('errors', []);
      this.controller.set('showSpinner', false);
    },

    createObject: function() {
      let self = this;
      let controller = this.controller;
      let riakObject = this.currentModel;
      let clusterName = riakObject.get('cluster').get('name');
      let bucketType = riakObject.get('bucketType');
      let bucket = riakObject.get('bucket');
      let bucketTypeName = bucketType.get('name');
      let bucketName = bucket.get('name');
      let objectName = riakObject.get('name');

      controller.set('errors', []);

      if (this.isValid(riakObject)) {
        let contents = riakObject.set('contents', Validations.isJsonParseable(riakObject.get('contents'))); // set contents of the object as the JSON parsed version;
        let serializedData = Formatter.formatRiakObject(riakObject.get('type'), contents);
        let createObject = bucketType.get('isCRDT') ?
          _.partial(this.explorer.createCRDT, clusterName, bucketTypeName, bucketName, objectName, serializedData) :
          _.bind(riakObject.save, riakObject);

        controller.set('spinnerMessage', 'Creating Object ...');
        controller.set('showSpinner', true);

        // createBucket()
        createObject()
          .then(function() {
            return self.explorer.refreshObjectList(bucket);
          })
          .then(
            function onSuccess() {
              self.transitionTo(riakObject.get('routePath'), clusterName, bucketTypeName, bucketName, objectName);
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
