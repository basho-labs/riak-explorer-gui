import Ember from 'ember';
import Alerts from '../../mixins/routes/alerts';
import LoadingSlider from '../../mixins/routes/loading-slider';
import ScrollReset from '../../mixins/routes/scroll-reset';
import WrapperState from '../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
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
      preLabel: 'Object',
      label: model.get('name')
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    if (model.get('contentTypeLanguage') === 'javascript') {
      controller.set('stringifiedContents', JSON.stringify(model.get('contents'), null, ' '));
    }
  },

  actions: {
    deleteObject: function(object) {
      let self = this;
      let controller = this.controller;
      let clusterName = object.get('cluster').get('name');
      let bucketTypeName = object.get('bucketType').get('name');
      let bucketName = object.get('bucket').get('name');
      let objectList = object.get('bucket').get('objectList');

      controller.set('loadingMessage', 'Deleting Object ...');
      controller.set('showLoadingSpinner', true);

      object.destroyRecord().then(
        function onSuccess() {
          self.transitionTo('bucket', clusterName, bucketTypeName, bucketName).then(function() {
            controller.set('showLoadingSpinner', false);
          });
        },
        function onError() {
          controller.set('showLoadingSpinner', false);
          self.showAlert('alerts.error-request-was-not-processed');
        }
      );
    }
  }
});
