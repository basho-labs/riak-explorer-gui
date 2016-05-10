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

  actions: {
    deleteObject: function(object) {
      let clusterName = object.get('cluster').get('name');
      let bucketTypeName = object.get('bucketType').get('name');
      let bucketName = object.get('bucket').get('name');
      let objectList = object.get('bucket').get('objectList');
      let self = this;

      object.destroyRecord().then(
        function onSuccess() {
          self.transitionTo('bucket', clusterName, bucketTypeName, bucketName);
        },
        function onError() {
          this.showAlert('alerts.error-request-was-not-processed');
        }
      );
    }
  }
});
