import Ember from 'ember';
import Alerts from '../../../mixins/routes/alerts';
import LoadingSlider from '../../../mixins/routes/loading-slider';
import ScrollReset from '../../../mixins/routes/scroll-reset';
import WrapperState from '../../../mixins/routes/wrapper-state';

export default Ember.Route.extend(Alerts, LoadingSlider, ScrollReset, WrapperState, {
  model(params) {
    let self = this;

    return this.explorer.getCluster(params.clusterName).then(function(cluster) {
      return self.store.createRecord('table-schema', { cluster: cluster });
    });
  },

  afterModel(model, transition) {
    this.setSidebarCluster(model.get('cluster'));
    this.setBreadCrumbs({
      cluster: model.get('cluster'),
      crudAction: 'create schema template'
    });
    this.setViewLabel({
      preLabel: 'Schema Template',
      label: 'Create'
    });
  },

  actions: {
    incorrectExtension: function() {
      this.controller.set('errors', "File must have an extension of .proto and be a protocol buffer file to be read.");
    },

    uploadFail(errorObj) {
      this.controller.set('errors', errorObj.error);
    },

    uploadSuccess(data) {
      this.controller.set('fileUploaded', true);
    }
  }
});
